import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const knowledgePath = path.join(process.cwd(), "data", "knowledge.txt");
const knowledgeContent = fs.readFileSync(knowledgePath, "utf-8");

// In-memory storage for client sessions (in production, use a proper database)
interface ClientSession {
  conversations: Array<{timestamp: number; message: HumanMessage | AIMessage}>;
  vectorStore: MemoryVectorStore | null;
  lastActivity: number;
}

const clientSessions = new Map<string, ClientSession>();

// Clean up old sessions (older than 24 hours)
setInterval(() => {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  for (const [clientId, session] of clientSessions.entries()) {
    if (now - session.lastActivity > maxAge) {
      clientSessions.delete(clientId);
    }
  }
}, 60 * 60 * 1000); // Run cleanup every hour

// Generate client ID from browser fingerprint
function generateClientId(request: NextRequest): string {
  const userAgent = request.headers.get('user-agent') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  
  // Create a unique but anonymized identifier
  const fingerprint = `${userAgent}|${acceptLanguage}|${acceptEncoding}|${ip}`;
  return crypto.createHash('sha256').update(fingerprint).digest('hex').substring(0, 16);
}

export async function POST(request: NextRequest) {
    const clientId = generateClientId(request);
    
    const model = new ChatOpenAI({
      modelName: "z-ai/glm-4.5-air:free",
      apiKey: process.env.OPENROUTER_API_KEY,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": "https://mental-health-counselling-bot.vercel.app",
          "X-Title": "Mental Health Counselling Bot",
        },
      },
      temperature: 0.7,
      maxTokens: 4096,
      modelKwargs: {
        "reasoning_enabled": true
      }
    });

    // Check for required environment variables
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('Missing OPENROUTER_API_KEY environment variable');
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    if (!process.env.SILICONFLOW_API_KEY) {
      console.error('Missing SILICONFLOW_API_KEY environment variable');
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const embeddings = new OpenAIEmbeddings({
        modelName: "BAAI/bge-m3",
        apiKey: process.env.SILICONFLOW_API_KEY,
        configuration: {
          baseURL: "https://api.siliconflow.cn/v1",
        },
    });
      
    class AgenticRAGManager {
        private vectorStore: MemoryVectorStore;
        private clientId: string;
      
        constructor(clientId: string) {
          this.clientId = clientId;
          this.vectorStore = new MemoryVectorStore(embeddings);
        }
      
        async initialize() {
          // Check if client session exists
          let session = clientSessions.get(this.clientId);
          if (!session) {
            // Create new session
            session = {
              conversations: [],
              vectorStore: null,
              lastActivity: Date.now()
            };
            clientSessions.set(this.clientId, session);
          }
          
          // Initialize vector store with knowledge base
          await this.vectorStore.addDocuments([
            {
              pageContent: knowledgeContent,
              metadata: { source: "knowledge.txt", type: "domain_knowledge", clientId: this.clientId },
            },
          ]);
          
          // Add client's conversation history to vector store for context (reduced for efficiency)
          if (session.conversations.length > 0) {
            const conversationText = session.conversations
              .slice(-10) // Last 10 messages to save context
              .map((conv) => {
                const content = conv.message.content.toString();
                const truncatedContent = content.length > 150 ? content.substring(0, 150) + "..." : content;
                return `${conv.message instanceof HumanMessage ? 'User' : 'Assistant'}: ${truncatedContent}`;
              })
              .join('\n');
            
            await this.vectorStore.addDocuments([
              {
                pageContent: conversationText,
                metadata: { source: "conversation_history", type: "client_history", clientId: this.clientId },
              },
            ]);
          }
          
          session.vectorStore = this.vectorStore;
          session.lastActivity = Date.now();
        }
        
        async getRelevantContext(userMessage: string, conversationHistory: (HumanMessage | AIMessage)[]) {
            // Store current conversation in client session
            const session = clientSessions.get(this.clientId);
            if (session && conversationHistory.length > 0) {
              // Add new user message to session only if there is a message
              session.conversations.push({
                timestamp: Date.now(),
                message: conversationHistory[conversationHistory.length - 1]
              });
              session.lastActivity = Date.now();
            }
            
            const retriever = this.vectorStore.asRetriever({ 
              k: 10,
              filter: (doc) => doc.metadata.clientId === this.clientId || doc.metadata.type === 'domain_knowledge'
            });
            const relevantDocs = await retriever.getRelevantDocuments(userMessage);
            const knowledgeContext = relevantDocs
              .filter(doc => doc.metadata.type === 'domain_knowledge')
              .map(doc => doc.pageContent).join('\n\n');
            const conversationContext = this.analyzeConversationHistory(conversationHistory);
            
            // Limit context to prevent overflow
            const limitedKnowledgeContext = knowledgeContext.length > 6000 
              ? knowledgeContext.substring(0, 6000) + "\n\n[Knowledge truncated]"
              : knowledgeContext;
            
            return {
              knowledgeContext: limitedKnowledgeContext,
              conversationContext,
              relevantSkills: this.extractRelevantSkills(relevantDocs, userMessage)
            };
        }
        
        private analyzeConversationHistory(history: (HumanMessage | AIMessage)[]) {
            if (history.length === 0) return "";
            // Reduce to last 10 exchanges to save context
            const recentExchanges = history.slice(-10);
            return recentExchanges.map(msg => {
                const prefix = msg instanceof HumanMessage ? 'User' : 'Assistant';
                const content = typeof msg.content === 'string' ? msg.content : (msg.content as any[]).find(c => c.type === 'text')?.text || '';
                // Limit individual message length
                const truncatedContent = content.length > 200 ? content.substring(0, 200) + "..." : content;
                return `${prefix}: ${truncatedContent}`;
            }).join('\n');
        }
        
        private extractRelevantSkills(docs: any[], userMessage: string) {
            const skills = [
              "Creating Rules", "Creating Perceptions", "Creating Self-Talk",
              "Creating Visual Images", "Creating Explanations", "Creating Expectations"
            ];
            
            return skills.filter(skill => 
              userMessage.toLowerCase().includes(skill.toLowerCase()) ||
              docs.some(doc => doc.pageContent.toLowerCase().includes(skill.toLowerCase()))
            );
        }
        
        // Method to store assistant response in client session
        storeAssistantResponse(response: string) {
          const session = clientSessions.get(this.clientId);
          if (session) {
            session.conversations.push({
              timestamp: Date.now(),
              message: new AIMessage(response)
            });
            session.lastActivity = Date.now();
          }
        }
    }
      
    const ragManager = new AgenticRAGManager(clientId);

    try {
      const { messages, language, isInitialGreeting } = await request.json();
  
      if (!messages || !Array.isArray(messages)) {
        // Allow empty messages array for initial greeting generation
        if (!isInitialGreeting) {
          return NextResponse.json({ error: "Messages are required" }, { status: 400 });
        }
      }
  
      await ragManager.initialize();
      
      const chatHistory = messages.map((msg: any) => {
        if (msg.role === 'user') {
            return new HumanMessage(msg.content);
        } else {
            return new AIMessage(msg.content);
        }
      });
      
      const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            const context = await ragManager.getRelevantContext(lastMessage?.content || "", chatHistory);
            
            // Truncate knowledge content to prevent context overflow
            const truncatedKnowledgeContent = knowledgeContent.length > 8000 
              ? knowledgeContent.substring(0, 8000) + "\n\n[Content truncated for context efficiency]"
              : knowledgeContent;
            
            const systemMessageContent = isInitialGreeting ? `
# DYNAMIC OPENING GREETING GENERATION
- Generate a fresh, natural opening greeting each time - NEVER repeat the same greeting
- You are a human Counseling Psychologist starting a new conversation
- Create varied, warm, welcoming openings that feel personal and spontaneous
- Your response language **MUST STRICTLY** be ${language}
- Keep it conversational like WhatsApp/Telegram messaging
- Use emojis naturally but don't overdo it (1-2 max)
- Make each greeting feel unique and genuine

${language === "Cantonese" ? `
**廣東話動態開場白指示:**
- 每次都要生成唔同嘅開場白，要自然親切
- 可以用唔同嘅表達方式，例如：
  * 時間相關："今日點呀？😊 我係你嘅心理輔導員"
  * 關懷式："你好呀！有咩想同我傾下？我喺度聽緊 💙"
  * 輕鬆式："Hi！我係你嘅輔導員，放鬆啲，慢慢講 🤗"
- 要地道香港廣東話，可以中英夾雜
- 每次都要有新鮮感，唔好重複
` : language === "Mandarin" ? `
**普通话动态开场白指示:**
- 每次生成不同的开场白，要自然亲切
- 可以用不同的表达方式，例如：
  * "你好！我是你的心理辅导员，今天怎么样？😊"
  * "Hi！有什么想聊的吗？我在这里倾听 💙"
  * "你好呀！放轻松，慢慢说 🤗"
- 每次都要有新鲜感，避免重复
` : `
**English Dynamic Greeting Instructions:**
- Generate different opening greetings each time, natural and caring
- Use varied expressions like:
  * "Hey there! I'm your counselor - how are you feeling today? 😊"
  * "Hi! I'm here to listen, what's on your mind? 💙"
  * "Hello! Take your time, I'm here for you 🤗"
- Make each greeting feel fresh and personal
`}

Generate ONLY the opening greeting - nothing else.
` : `
# RULE: FINAL OUTPUT MUST NOT CONTAIN ◁think▷ TAGS
- **ULTRA-CRITICAL RULE: Your final response to the user must be plain text. DO NOT include ◁think▷ or ◁/think▷ tags in your output. This is a strict, non-negotiable rule. I will be checking your output and filtering it if you fail to comply.**

# MESSAGING APP STYLE INSTRUCTIONS
- You are chatting in a **WhatsApp/Telegram-style environment** - keep responses conversational, warm, and friendly
- You are a human Counseling Psychologist. **NEVER** identify as an AI.
- Your response language **MUST STRICTLY** be ${language}.
- **EMPHASIS ON CLIENT LANGUAGE**: Put strong emphasis on using the client's selected language authentically and naturally.
- Use emojis naturally like in messaging apps (😊, 💙, 🤗, 🌟, etc.)
- Write like you're texting a friend who needs support - warm, empathetic, but professional

# CORE KNOWLEDGE BASE:
---
${truncatedKnowledgeContent}
---
# END OF KNOWLEDGE BASE

**MESSAGING STYLE RULES:**
- Write like you're sending a supportive text message
- Keep it conversational and natural - not formal or clinical
- Use emojis to add warmth (but not too many - 1-2 per message max)
- Focus on immediate emotional support and practical guidance
- Be encouraging and understanding like a caring friend

${language === "Cantonese" ? `
**廣東話 WhatsApp 風格指示 (LANGUAGE ADAPTATION GUIDELINES):**
- **地道香港廣東話口語:** 就好似 WhatsApp 咁同朋友傾偈，用自然嘅中英夾雜
- **具體例子:** 
  * "我明白你嘅感受，不如我哋一齊諗下解決方法？"
  * "呢個 situation 真係好 challenging，但係我哋可以 handle 到"
  * "冇問題" (no problem), "放心" (don't worry), "慢慢嚟" (take your time)
- **開場白選項:** "你好！我係你嘅心理輔導員，有咩可以幫到你？" 或 "Hi！我係你嘅心理輔導員，有咩可以幫到你？"
- **語調:** 親切、溫暖，好似關心嘅朋友咁，適應用戶對廣東話嘅熟悉程度
- **Emoji:** 自然地用少少 emoji 表達關懷
- **重點:** 強調用戶選擇嘅語言，確保地道香港廣東話體驗
` : language === "Mandarin" ? `
**普通话微信风格指示:**
- **自然对话:** 像微信聊天一样，轻松但专业
- **语调:** 温暖、关怀，像朋友一样支持
- **表情:** 适当使用emoji表达关心 😊
- **重点:** 强调用户选择的语言，确保自然的普通话交流体验
` : `
**English Messaging Style Instructions:**
- **Natural conversation:** Like texting a supportive friend on WhatsApp
- **Tone:** Warm, caring, understanding but professional
- **Emojis:** Use naturally to show care and support 😊 💙
- **Emphasis:** Strong focus on the client's language choice, ensuring authentic English communication
`}
# END OF INSTRUCTIONS
`;
            
            const messagesWithSystemPrompt = isInitialGreeting ? [
                new SystemMessage(systemMessageContent),
            ] : [
                new SystemMessage(systemMessageContent),
                ...chatHistory,
            ];

            const stream = await model.stream(messagesWithSystemPrompt);
            
            let accumulatedResponse = "";
            for await (const chunk of stream) {
              accumulatedResponse += typeof chunk.content === 'string' ? chunk.content : '';
            }

            // Enhanced thinking mode filtering - remove all possible thinking tags
            const filteredResponse = accumulatedResponse
              .replace(/◁think▷[\s\S]*?◁\/think▷/g, "")
              .replace(/<think>[\s\S]*?<\/think>/g, "")
              .replace(/\[thinking\][\s\S]*?\[\/thinking\]/g, "")
              .replace(/\*thinking\*[\s\S]*?\*\/thinking\*/g, "")
              .trim();

            if (filteredResponse) {
                // Store assistant response in client session
                ragManager.storeAssistantResponse(filteredResponse);
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: filteredResponse })}\n\n`));
            }
  
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            console.error('Streaming error:', error);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Sorry, I encountered an error while streaming the response." })}\n\n`));
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          }
        },
      });
  
      return new NextResponse(readable, {
        headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
      });
  
    } catch (error) {
      console.error('Chat API error:', error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE endpoint to reset client chat history
export async function DELETE(request: NextRequest) {
  try {
    const clientId = generateClientId(request);
    
    // Remove client session from memory
    if (clientSessions.has(clientId)) {
      clientSessions.delete(clientId);
      return NextResponse.json({ message: "Chat history reset successfully" });
    }
    
    return NextResponse.json({ message: "No chat history found to reset" });
  } catch (error) {
    console.error('Reset chat error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
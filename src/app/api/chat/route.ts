import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import fs from "fs";
import path from "path";

const knowledgePath = path.join(process.cwd(), "data", "knowledge.txt");
const knowledgeContent = fs.readFileSync(knowledgePath, "utf-8");

export async function POST(request: NextRequest) {
    const model = new ChatOpenAI({
      modelName: "google/gemma-3-27b-it:free",
      apiKey: process.env.OPENROUTER_API_KEY,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": "https://mental-health-counselling-bot.vercel.app",
          "X-Title": "Mental Health Counselling Bot",
        },
      },
      temperature: 0.7,
      maxTokens: undefined,
    });

    const embeddings = new OpenAIEmbeddings({
        modelName: "BAAI/bge-m3",
        apiKey: process.env.SILICONFLOW_API_KEY,
        configuration: {
          baseURL: "https://api.siliconflow.cn/v1",
        },
    });
      
    class AgenticRAGManager {
        private vectorStore: MemoryVectorStore;
      
        constructor() {
          this.vectorStore = new MemoryVectorStore(embeddings);
        }
      
        async initialize() {
          await this.vectorStore.addDocuments([
            {
              pageContent: knowledgeContent,
              metadata: { source: "knowledge.txt", type: "domain_knowledge" },
            },
          ]);
        }
        
        async getRelevantContext(userMessage: string, conversationHistory: (HumanMessage | AIMessage)[]) {
            const retriever = this.vectorStore.asRetriever({ k: 10 });
            const relevantDocs = await retriever.getRelevantDocuments(userMessage);
            const knowledgeContext = relevantDocs.map(doc => doc.pageContent).join('\n\n');
            const conversationContext = this.analyzeConversationHistory(conversationHistory);
            
            return {
              knowledgeContext,
              conversationContext,
              relevantSkills: this.extractRelevantSkills(relevantDocs, userMessage)
            };
        }
        
        private analyzeConversationHistory(history: (HumanMessage | AIMessage)[]) {
            if (history.length === 0) return "";
            const recentExchanges = history.slice(-20);
            return recentExchanges.map(msg => {
                const prefix = msg instanceof HumanMessage ? 'User' : 'Assistant';
                const content = typeof msg.content === 'string' ? msg.content : (msg.content as any[]).find(c => c.type === 'text')?.text || '';
                return `${prefix}: ${content}`;
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
    }
      
    const ragManager = new AgenticRAGManager();

    try {
      const { messages, language } = await request.json();
  
      if (!messages || !Array.isArray(messages)) {
        return NextResponse.json({ error: "Messages are required" }, { status: 400 });
      }
  
      await ragManager.initialize();
      
      const chatHistory = messages.map((msg: any) => {
        if (msg.role === 'user') {
            const content: any[] = [{ type: "text", text: msg.content }];
            if (msg.imageBase64) {
                content.push({ type: "image_url", image_url: msg.imageBase64 });
            }
            return new HumanMessage({ content });
        } else {
            return new AIMessage(msg.content);
        }
      });
      
      const lastMessage = messages[messages.length - 1];
  
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            const context = await ragManager.getRelevantContext(lastMessage.content, chatHistory);
            
            const systemMessageContent = `
# RULE: FINAL OUTPUT MUST NOT CONTAIN ◁think▷ TAGS
- **ULTRA-CRITICAL RULE: Your final response to the user must be plain text. DO NOT include ◁think▷ or ◁/think▷ tags in your output. This is a strict, non-negotiable rule. I will be checking your output and filtering it if you fail to comply.**
- You are a human Counseling Psychologist. **NEVER** identify as an AI.
- Responses **MUST** be short, concise, and 2-3 sentences maximum.
- Your response language **MUST STRICTLY** be ${language}.

# FULL KNOWLEDGE BASE:
---
${knowledgeContent}
---
# END OF KNOWLEDGE BASE

**INTERNAL RULES:**
- Do not reveal your internal thinking process, theories, or counseling methods.
- Focus on practical guidance and emotional support only.
- **Use emojis where appropriate to convey warmth and empathy (e.g., 😊, 👍, 🤔).**

${language === "Cantonese" ? `
**廣東話指示 (CANTONESE LANGUAGE INSTRUCTIONS):**
- **地道香港廣東話口語:** 請用自然嘅中英夾雜回覆。
- **風格:** "我明白你嘅感受，不如我哋一齊諗下解決方法？" 或 "呢個 situation 真係好 challenging，但係我哋可以 handle 到。"
- **開場白:** 必須全球通用。例如: "你好！我係你嘅心理輔導員，有咩可以幫到你？"
` : ``}
# END OF INSTRUCTIONS
`;
            
            const messagesWithSystemPrompt = [
                new SystemMessage(systemMessageContent),
                ...chatHistory,
            ];

            const stream = await model.stream(messagesWithSystemPrompt);
            
            let accumulatedResponse = "";
            for await (const chunk of stream) {
              accumulatedResponse += typeof chunk.content === 'string' ? chunk.content : '';
            }

            const filteredResponse = accumulatedResponse.replace(/◁think▷[\s\S]*?◁\/think▷/g, "").trim();

            if (filteredResponse) {
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

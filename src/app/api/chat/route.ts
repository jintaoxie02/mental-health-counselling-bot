import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import prisma from "@/lib/db";
import fs from "fs";
import path from "path";

const knowledgePath = path.join(process.cwd(), "data", "knowledge.txt");
const knowledgeContent = fs.readFileSync(knowledgePath, "utf-8");

// We are not using Vercel AI SDK anymore, but this is a good practice
export const runtime = 'edge';

const model = new ChatOpenAI({
  modelName: "google/gemma-3-27b-it:free",
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL, 
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

async function getConversationHistory(clientId: string): Promise<(HumanMessage | AIMessage)[]> {
    const messages = await prisma.message.findMany({
        where: { clientId },
        orderBy: { createdAt: 'asc' },
    });
    return messages.map(msg => msg.isUser ? new HumanMessage(msg.content) : new AIMessage(msg.content));
}

export async function POST(request: NextRequest) {
    try {
        let { messages, language, clientId } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Messages are required" }, { status: 400 });
        }
        
        if (!clientId) {
            const newClient = await prisma.client.create({ data: {} });
            clientId = newClient.id;
        } else {
            const clientExists = await prisma.client.findUnique({ where: { id: clientId } });
            if (!clientExists) {
                await prisma.client.create({ data: { id: clientId } });
            }
        }

        const conversationHistory = await getConversationHistory(clientId);
        const lastUserMessage = messages[messages.length - 1];

        // This is a simplified RAG, we'll improve it later.
        // For now, we are just using the knowledge base as a big system prompt.

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                try {
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

                    const messagesWithSystemPrompt: (SystemMessage | HumanMessage | AIMessage)[] = [
                        new SystemMessage(systemMessageContent),
                        ...conversationHistory,
                        new HumanMessage(lastUserMessage.content),
                    ];

                    const stream = await model.stream(messagesWithSystemPrompt);

                    let accumulatedResponse = "";
                    for await (const chunk of stream) {
                        const content = typeof chunk.content === 'string' ? chunk.content : '';
                        accumulatedResponse += content;
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: content })}\n\n`));
                    }
                    
                    const filteredResponse = accumulatedResponse.replace(/◁think▷[\s\S]*?◁\/think▷/g, "").trim();

                    if (lastUserMessage.content) {
                        await prisma.message.create({
                            data: {
                                content: lastUserMessage.content,
                                isUser: true,
                                clientId: clientId,
                            }
                        });
                    }
                    if (filteredResponse) {
                        await prisma.message.create({
                            data: {
                                content: filteredResponse,
                                isUser: false,
                                clientId: clientId,
                            }
                        });
                    }

                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ clientId })}\n\n`));
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

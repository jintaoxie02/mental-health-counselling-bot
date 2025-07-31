import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { Document } from "@langchain/core/documents";
import fs from "fs/promises";
import path from "path";

const knowledgePath = path.join(process.cwd(), "data", "knowledge.txt");
let knowledgeContent = "";
fs.readFile(knowledgePath, "utf-8").then(content => knowledgeContent = content);

const historyDir = path.join(process.cwd(), "data", "history");

async function ensureHistoryDir() {
    try {
        await fs.access(historyDir);
    } catch {
        await fs.mkdir(historyDir, { recursive: true });
    }
}
ensureHistoryDir();

async function getHistoryFilePath(clientId: string) {
    return path.join(historyDir, `${clientId}.json`);
}

async function readHistory(clientId: string): Promise<Document[]> {
    const filePath = await getHistoryFilePath(clientId);
    try {
        const data = await fs.readFile(filePath, "utf-8");
        const serialized = JSON.parse(data);
        return serialized.map((s: any) => new Document({
            pageContent: s.pageContent,
            metadata: s.metadata,
        }));
    } catch (e) {
        if (e instanceof Error && 'code' in e && e.code !== 'ENOENT') {
            console.error("Failed to load history:", e);
        }
        return [];
    }
}

async function writeHistory(clientId: string, documents: Document[]) {
    const filePath = await getHistoryFilePath(clientId);
    const serialized = documents.map(doc => ({
        pageContent: doc.pageContent,
        metadata: doc.metadata,
    }));
    await fs.writeFile(filePath, JSON.stringify(serialized, null, 2));
}

export async function POST(request: NextRequest) {
    try {
        const { messages, language, clientId } = await request.json();

        if (!clientId) return NextResponse.json({ error: "Client ID is required" }, { status: 400 });

        const model = new ChatOpenAI({
            modelName: "google/gemma-3-27b-it:free",
            apiKey: process.env.OPENROUTER_API_KEY,
            configuration: { baseURL: "https://openrouter.ai/api/v1" },
            temperature: 0.7,
        });

        const history = await readHistory(clientId);
        
        const lastUserMessage = messages[messages.length - 1];
        const userDoc = new Document({
            pageContent: lastUserMessage.content,
            metadata: { role: 'user', timestamp: new Date().toISOString(), language },
        });
        
        const newHistory = [...history, userDoc];

        const context = newHistory.map(doc => {
            const lang = doc.metadata.language || 'English';
            return `[${lang}] ${doc.metadata.role}: ${doc.pageContent}`;
        }).join('\n\n');

        const systemMessageContent = `You are a human Counseling Psychologist. NEVER identify as an AI. Your responses MUST be short, concise, and 2-3 sentences maximum.
        
        CRITICAL: Your response language MUST STRICTLY be ${language}. Do not deviate from this language under any circumstances.
        
        # CONTEXT:
        ${context}
        
        ${language === "Cantonese" ? `# CANTONESE INSTRUCTIONS:\n- Use authentic Hong Kong Cantonese with natural English mixing.\n- Example: "我明白你嘅感受，不如我哋一齊諗下解決方法？"` : ''}`;
        
        const chatHistory = messages.map((msg: any) => msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content));

        const stream = await model.stream([new SystemMessage(systemMessageContent), ...chatHistory]);

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                let assistantResponse = "";
                for await (const chunk of stream) {
                    const content = chunk.content.toString();
                    assistantResponse += content;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
                const assistantDoc = new Document({
                    pageContent: assistantResponse,
                    metadata: { role: 'assistant', timestamp: new Date().toISOString(), language },
                });
                
                await writeHistory(clientId, [...newHistory, assistantDoc]);

                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
            },
            cancel() {
                console.log("Stream cancelled by client.");
            }
        });

        return new NextResponse(readable, {
            headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
        });

    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
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

class PersistentVectorStore extends MemoryVectorStore {
    private filePath: string;

    constructor(embeddings: OpenAIEmbeddings, clientId: string) {
        super(embeddings);
        this.filePath = path.join(historyDir, `${clientId}.json`);
    }

    async save() {
        const serialized = this.memoryVectors.map(mv => ({
            content: mv.pageContent,
            embedding: Array.from(mv.embedding),
            metadata: mv.metadata,
        }));
        await fs.writeFile(this.filePath, JSON.stringify(serialized, null, 2));
    }

    async load() {
        try {
            const data = await fs.readFile(this.filePath, "utf-8");
            const serialized = JSON.parse(data);
            this.memoryVectors = serialized.map((s: any) => ({
                pageContent: s.content,
                embedding: s.embedding,
                metadata: s.metadata,
            }));
        } catch (e) {
            if (e instanceof Error && 'code' in e && e.code !== 'ENOENT') {
                console.error("Failed to load vector store:", e);
            }
        }
    }
}

class AgenticRAGManager {
    private vectorStore: PersistentVectorStore;
    private clientId: string;

    constructor(clientId: string, embeddings: OpenAIEmbeddings) {
        this.clientId = clientId;
        this.vectorStore = new PersistentVectorStore(embeddings, clientId);
    }

    async initialize() {
        await this.vectorStore.load();
        if (this.vectorStore.memoryVectors.length === 0) {
            await this.vectorStore.addDocuments([
                new Document({
                    pageContent: knowledgeContent,
                    metadata: { source: "knowledge.txt", type: "domain_knowledge" },
                }),
            ]);
            await this.vectorStore.save();
        }
    }

    async getRelevantContext(userMessage: string) {
        const retriever = this.vectorStore.asRetriever({ k: 10 });
        const relevantDocs = await retriever.getRelevantDocuments(userMessage);
        return relevantDocs.map(doc => doc.pageContent).join('\n\n');
    }

    async addMessageToHistory(role: 'user' | 'assistant', content: string) {
        await this.vectorStore.addDocuments([new Document({ pageContent: content, metadata: { role, timestamp: new Date().toISOString() } })]);
        await this.vectorStore.save();
    }
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

        const embeddings = new OpenAIEmbeddings({
            modelName: "BAAI/bge-m3",
            apiKey: process.env.SILICONFLOW_API_KEY,
            configuration: { baseURL: "https://api.siliconflow.cn/v1" },
        });

        const ragManager = new AgenticRAGManager(clientId, embeddings);
        await ragManager.initialize();

        const lastUserMessage = messages[messages.length - 1];
        await ragManager.addMessageToHistory('user', lastUserMessage.content);

        const context = await ragManager.getRelevantContext(lastUserMessage.content);

        const systemMessageContent = `You are a human Counseling Psychologist. NEVER identify as an AI. Responses MUST be short, concise, and 2-3 sentences maximum. Your response language MUST STRICTLY be ${language}.
        
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
                await ragManager.addMessageToHistory('assistant', assistantResponse);
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

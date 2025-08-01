import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import fs from "fs";
import path from "path";

// ... (model, embeddings, AgenticRAGManager class setup)
  
const ragManager = new AgenticRAGManager();

export async function POST(request: NextRequest) {
    try {
      const { messages, language } = await request.json();
  
      if (!messages || !Array.isArray(messages)) {
        return NextResponse.json({ error: "Messages are required" }, { status: 400 });
      }
  
      await ragManager.initialize();
      
      // Simplified chat history mapping for text-only
      const chatHistory = messages.map((msg: any) => {
        if (msg.role === 'user') {
            return new HumanMessage(msg.content);
        } else {
            return new AIMessage(msg.content);
        }
      });
      
      const lastMessage = messages[messages.length - 1];
  
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            // ... (SystemMessage content remains the same)
            
            const messagesWithSystemPrompt = [ new SystemMessage(systemMessageContent), ...chatHistory ];

            const stream = await model.stream(messagesWithSystemPrompt);
            
            // ... (Streaming logic remains the same)

          } catch (error) {
            // ... (error handling)
          }
        },
      });
  
      return new NextResponse(readable, { /* ... */ });
  
    } catch (error) {
      console.error('Chat API error:', error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Generate client ID from browser fingerprint (same as in main chat route)
function generateClientId(request: NextRequest): string {
  const userAgent = request.headers.get('user-agent') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  
  const fingerprint = `${userAgent}|${acceptLanguage}|${acceptEncoding}|${ip}`;
  return crypto.createHash('sha256').update(fingerprint).digest('hex').substring(0, 16);
}

// Simple in-memory storage for chat sessions (in production, use a proper database)
interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
  messageCount: number;
}

const clientChatSessions = new Map<string, ChatSession[]>();

export async function GET(request: NextRequest) {
  try {
    const clientId = generateClientId(request);
    const sessions = clientChatSessions.get(clientId) || [];
    
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Get chat history error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientId = generateClientId(request);
    const { title, lastMessage } = await request.json();
    
    if (!title || !lastMessage) {
      return NextResponse.json({ error: "Title and lastMessage are required" }, { status: 400 });
    }
    
    const sessions = clientChatSessions.get(clientId) || [];
    
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: title.substring(0, 50), // Limit title length
      lastMessage: lastMessage.substring(0, 100), // Limit preview length
      timestamp: Date.now(),
      messageCount: 1
    };
    
    sessions.unshift(newSession); // Add to beginning
    
    // Keep only the last 10 sessions per client
    if (sessions.length > 10) {
      sessions.splice(10);
    }
    
    clientChatSessions.set(clientId, sessions);
    
    return NextResponse.json({ message: "Session saved", session: newSession });
  } catch (error) {
    console.error('Save chat session error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const clientId = generateClientId(request);
    const { sessionId, lastMessage } = await request.json();
    
    if (!sessionId || !lastMessage) {
      return NextResponse.json({ error: "SessionId and lastMessage are required" }, { status: 400 });
    }
    
    const sessions = clientChatSessions.get(clientId) || [];
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    
    sessions[sessionIndex].lastMessage = lastMessage.substring(0, 100);
    sessions[sessionIndex].timestamp = Date.now();
    sessions[sessionIndex].messageCount += 1;
    
    clientChatSessions.set(clientId, sessions);
    
    return NextResponse.json({ message: "Session updated" });
  } catch (error) {
    console.error('Update chat session error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const clientId = generateClientId(request);
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    
    if (!sessionId) {
      // Delete all sessions for this client
      clientChatSessions.delete(clientId);
      return NextResponse.json({ message: "All sessions deleted" });
    }
    
    const sessions = clientChatSessions.get(clientId) || [];
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    
    if (filteredSessions.length === sessions.length) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    
    clientChatSessions.set(clientId, filteredSessions);
    
    return NextResponse.json({ message: "Session deleted" });
  } catch (error) {
    console.error('Delete chat session error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getClientStats, getConversationContext } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    const stats = await getClientStats(clientId);
    const context = await getConversationContext(clientId, 6);

    return NextResponse.json({ stats, context });
  } catch (error) {
    console.error('Error in history API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    // Use the client API for deletion
    const response = await fetch(`${request.nextUrl.origin}/api/client?clientId=${clientId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: 'Failed to delete history' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  let clientId = cookieStore.get('client-id')?.value;
  
  const response = new NextResponse(JSON.stringify({ clientId: clientId || nanoid() }), {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!clientId) {
    clientId = nanoid();
    response.cookies.set('client-id', clientId, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60, // 1 year
    });
    // We need to update the body to include the new client ID
    return new NextResponse(JSON.stringify({ clientId }), {
        headers: { 'Content-Type': 'application/json' },
    });
  }

  return response;
}

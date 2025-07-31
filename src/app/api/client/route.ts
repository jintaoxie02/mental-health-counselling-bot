import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  let clientId = cookieStore.get('client-id')?.value;

  if (!clientId) {
    clientId = nanoid();
    cookieStore.set('client-id', clientId, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60, // 1 year
    });
  }

  return NextResponse.json({ clientId });
}

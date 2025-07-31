import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    let clientId = request.cookies.get('client-id')?.value;

    if (clientId) {
        return NextResponse.json({ clientId });
    }

    clientId = nanoid();
    const response = NextResponse.json({ clientId });
    response.cookies.set('client-id', clientId, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60, // 1 year
    });

    return response;
}

import { NextResponse } from 'next/server';
import { registerUser } from '@/actions/register';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await registerUser(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

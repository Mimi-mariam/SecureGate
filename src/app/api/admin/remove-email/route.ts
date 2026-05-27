import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// Request schema for validation
const DeleteEmailSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = DeleteEmailSchema.parse(body);
    const { email } = parsed;

    // Delete user(s) with the given email
    const result = await db.user.deleteMany({
      where: { email },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'No user found with that email.' }, { status: 404 });
    }
    return NextResponse.json({ success: `Deleted ${result.count} user(s) with email ${email}.` });
  } catch (error) {
    console.error('Delete email error:', error);
    const message = error instanceof Error ? error.message : 'Invalid request.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

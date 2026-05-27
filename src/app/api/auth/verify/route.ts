import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/auth?error=missing_token", req.url));
  }

  try {
    const existingToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return NextResponse.redirect(new URL("/auth?error=invalid_token", req.url));
    }

    if (new Date() > existingToken.expires) {
      await db.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: existingToken.identifier,
            token: existingToken.token,
          },
        },
      });
      return NextResponse.redirect(new URL("/auth?error=expired_token", req.url));
    }

    await db.user.update({
      where: { email: existingToken.identifier },
      data: { emailVerified: new Date() },
    });

    await db.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: existingToken.identifier,
          token: existingToken.token,
        },
      },
    });

    return NextResponse.redirect(new URL("/auth/verify?verified=true", req.url));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(new URL("/auth?error=server_error", req.url));
  }
}

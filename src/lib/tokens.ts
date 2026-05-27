import { db } from "@/lib/db";
import crypto from "node:crypto";

function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function generateVerificationToken(email: string) {
  const token = generateSecureToken();
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  const existingToken = await db.verificationToken.findFirst({
    where: { identifier: email },
  });

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: existingToken.token,
        },
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return verificationToken;
}

export async function generatePasswordResetToken(email: string) {
  const token = generateSecureToken();
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  const existingToken = await db.passwordResetToken.findFirst({
    where: { email },
  });

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
}

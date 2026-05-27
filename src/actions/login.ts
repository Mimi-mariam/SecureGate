"use server";

import { LoginSchema } from "@/lib/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { resendVerificationCode } from "@/actions/verify";

export async function loginUser(values: unknown) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email or password." };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    // After successful sign‑in, check verification status
    const user = await db.user.findUnique({ where: { email } });
    if (user && !user.emailVerified) {
      const result = await resendVerificationCode(email, user.name ?? "");
      if (result?.error) {
        return { error: result.error };
      }
    }
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials. Please verify your access key." };
        default:
          return { error: "Access denied. Security authentication failed." };
      }
    }
    throw error;
  }
}

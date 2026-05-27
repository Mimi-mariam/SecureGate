import { NextRequest, NextResponse } from "next/server";
import { POST as AuthPOST } from "@/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export { GET } from "@/auth";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const result = checkRateLimit(ip, 5, 10 * 60 * 1000);

  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(result.resetIn / 1000)),
        },
      }
    );
  }

  return AuthPOST(request);
}

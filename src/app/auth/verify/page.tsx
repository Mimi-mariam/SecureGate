import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { resendVerificationCode } from "@/actions/verify";

export const metadata = {
  title: "SecureGate | Verify Email",
  description: "Verify your email address to activate your account.",
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth");
  }

  if ((session.user as { emailVerified?: Date | null }).emailVerified) {
    redirect("/dashboard");
  }

  const justVerified = searchParams.verified === "true";
  const userEmail = session.user!.email!;
  const userName = session.user!.name || "Operator";

  const resend = async () => {
    "use server";
    await resendVerificationCode(userEmail, userName);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px",
      position: "relative"
    }} className="animate-fade-in">
      <div className="glass-panel" style={{
        maxWidth: "420px",
        width: "100%",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        textAlign: "center"
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          width: "48px",
          height: "48px",
          borderRadius: "var(--radius-md)",
          background: "linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)",
          fontSize: "20px",
          fontWeight: "800",
          color: "#ffffff",
          boxShadow: "0 6px 18px var(--brand-glow)"
        }}>
          SG
        </div>

        {justVerified ? (
          <>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>
              Email Verified
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
              Your email has been verified successfully.
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
              Please sign out and sign back in to refresh your session.
            </p>
            <form action={async () => {
              "use server";
              const { signOut } = await import("@/auth");
              await signOut({ redirectTo: "/auth" });
            }}>
              <button type="submit" className="btn-primary" style={{
                width: "100%",
                padding: "14px",
                cursor: "pointer",
                border: "none",
                fontWeight: "700",
                fontSize: "14px"
              }}>
                Sign Out &amp; Sign In
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff" }}>
              Verify Your Email
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
              A verification link has been sent to<br />
              <strong style={{ color: "var(--brand-primary)" }}>{session.user.email}</strong>
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
              Please check your inbox and click the link to verify your account. The link expires in 15 minutes.
            </p>
            <form action={resend}>
              <button type="submit" className="verify-link-btn" style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--brand-primary)",
                fontWeight: "600",
                fontSize: "13px",
                padding: "8px 0",
                transition: "var(--transition-fast)"
              }}>
                Resend verification link
              </button>
            </form>
            <form action={async () => {
              "use server";
              const { signOut } = await import("@/auth");
              await signOut({ redirectTo: "/auth" });
            }}>
              <button type="submit" className="signout-link-btn" style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
                fontWeight: "600",
                fontSize: "13px",
                padding: "8px 0",
                transition: "var(--transition-fast)"
              }}>
                Sign out
              </button>
            </form>
          </>
        )}
      </div>
      <style>{`
        .verify-link-btn:hover {
          color: var(--brand-secondary) !important;
        }
        .signout-link-btn:hover {
          color: var(--error) !important;
        }
      `}</style>
    </div>
  );
}

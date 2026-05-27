"use client";

import React, { Suspense, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/actions/reset-password";

import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await resetPassword({ token, password });
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        setSuccess(res.success);
      }
    });
  };

  if (!token) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px"
      }}>
        <div className="glass-panel" style={{ maxWidth: "420px", width: "100%", padding: "40px", textAlign: "center" }}>
          <p style={{ color: "var(--error)", fontSize: "14px" }}>Invalid reset link. No token provided.</p>
          <Link href="/auth/forgot-password" style={{ color: "var(--brand-primary)", fontWeight: "600", textDecoration: "none" }}>
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

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
        gap: "28px"
      }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
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
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff", marginTop: "8px" }}>
            Reset Password
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Enter your new password below.
          </p>
        </div>

        {error && (
          <div style={{
            padding: "12px 16px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--error-glow)",
            border: "1px solid rgba(244, 63, 94, 0.15)",
            color: "var(--error)",
            fontSize: "13px",
            fontWeight: "500",
            lineHeight: "1.4",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: "12px 16px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--success-glow)",
            border: "1px solid rgba(16, 185, 129, 0.15)",
            color: "var(--success)",
            fontSize: "13px",
            fontWeight: "500",
            lineHeight: "1.4",
            textAlign: "center"
          }}>
            {success}
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="form-group" style={{ marginBottom: "4px" }}>
              <label htmlFor="reset-password" className="form-label">New Password</label>
              <input
                id="reset-password"
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••••••"
                required
                autoFocus
                disabled={isPending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isPending}
              style={{ width: "100%", padding: "14px" }}
            >
              {isPending ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        {success && (
          <footer style={{ textAlign: "center", fontSize: "13px", color: "var(--text-secondary)" }}>
            <Link href="/auth" className="link-accent">
              Sign in
            </Link>
          </footer>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

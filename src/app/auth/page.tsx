"use client";

import React, { Suspense, useState, useTransition, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loginUser } from "@/actions/login";

type AuthMode = "login" | "register";

function AuthContent() {
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified") === "true";

  const [mode, setMode] = useState<AuthMode>("register");
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [regData, setRegData] = useState({ employeeId: "", name: "" });
  const [isPending, startTransition] = useTransition();
  const [loginPending, setLoginPending] = useState(false);
  const banner = verified ? "Email verified successfully! You can now sign in."
    : searchParams.get("error") === "invalid_token" ? "Invalid verification link."
    : searchParams.get("error") === "expired_token" ? "Verification link has expired."
    : searchParams.get("error") === "server_error" ? "Something went wrong. Please try again."
    : null;

  const router = useRouter();
  useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "login" || urlMode === "register") {
      setMode(urlMode);
    } else if (verified) {
      setMode("login");
    }
    if (searchParams.toString()) {
      router.replace("/auth", { scroll: false });
    }
  }, [router, searchParams, verified]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = "Field must not be empty";
    if (!password.trim()) errors.password = "Field must not be empty";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoginPending(true);
    const res = await loginUser({ email, password });
    setLoginPending(false);

    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      window.location.href = "/dashboard";
    }
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = "Field must not be empty";
    if (!password.trim()) errors.password = "Field must not be empty";

    const hasRealtimeErrors = Object.entries(fieldErrors).some(
      ([key, val]) => val !== "" && (key === "email" || key === "password")
    );

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0 || hasRealtimeErrors) return;

    startTransition(async () => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...regData, email, password }),
    });
    const res = await response.json();
    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setSuccess(`${res.success} Redirecting to sign in...`);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => {
        setMode("login");
        setStep(1);
        setSuccess(null);
      }, 2000);
    }
  } catch (err) {
    console.error('Registration API error:', err);
    setError('An unexpected error occurred.');
  }
});
  };

  const handleNext = () => {
    const errors: Record<string, string> = {};
    const employeeId = (document.getElementById("reg-employeeId") as HTMLInputElement)?.value.trim();
    const name = (document.getElementById("reg-name") as HTMLInputElement)?.value.trim();
    if (!employeeId) errors.employeeId = "Field must not be empty";
    if (!name) errors.name = "Field must not be empty";
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) {
      setRegData({ employeeId: employeeId || "", name: name || "" });
      setStep(2);
    }
  };

  const switchMode = () => {
    setError(null);
    setSuccess(null);
    setFieldErrors({});
    setRegData({ employeeId: "", name: "" });
    setMode(mode === "login" ? "register" : "login");
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
        gap: "28px"
      }}>
        {/* Branding header */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
          {banner && (
            <div style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: banner.includes("successfully") ? "var(--success-glow)" : "var(--error-glow)",
              border: `1px solid ${banner.includes("successfully") ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)"}`,
              color: banner.includes("successfully") ? "var(--success)" : "var(--error)",
              fontSize: "13px",
              fontWeight: "500",
              lineHeight: "1.4",
              textAlign: "center"
            }}>
              {banner.includes("successfully") ? "✓ " : "⚠️ "}{banner}
            </div>
          )}
          {error && mode === "login" && (
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
            {mode === "login" ? "Sign In" : "Create Account"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            {mode === "register" && "Register your credentials to authorize account access."}
          </p>
        </div>

        {/* Login form */}
        {mode === "login" && (
          <form onSubmit={handleLogin} noValidate style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                className="form-input"
                placeholder="alex@securegate.io"
                required
                disabled={loginPending}
                style={fieldErrors.email ? { borderColor: "var(--error)" } : undefined}
                onChange={() => setFieldErrors((prev) => ({ ...prev, email: "" }))}
                onFocus={() => setError(null)}
              />
              {fieldErrors.email && (
                <div style={{ color: "var(--error)", fontSize: "12px", marginTop: "4px", textAlign: "left" }}>
                  {fieldErrors.email}
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label htmlFor="login-password" className="form-label">Password</label>
                <span
                  onClick={() => router.push("/auth/forgot-password")}
                  style={{
                    color: "var(--brand-primary)",
                    fontWeight: "500",
                    fontSize: "12px",
                    textDecoration: "none",
                    transition: "var(--transition-fast)",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--brand-secondary)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--brand-primary)"}
                >
                  Forgot Password?
                </span>
              </div>
              <input
                id="login-password"
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••••••"
                required
                disabled={loginPending}
                style={fieldErrors.password ? { borderColor: "var(--error)" } : undefined}
                onChange={() => setFieldErrors((prev) => ({ ...prev, password: "" }))}
                onFocus={() => setError(null)}
              />
              {fieldErrors.password && (
                <div style={{ color: "var(--error)", fontSize: "12px", marginTop: "4px", textAlign: "left" }}>
                  {fieldErrors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loginPending}
              style={{ width: "100%", padding: "14px" }}
            >
              {loginPending ? "Signing In..." : "Log In"}
            </button>
          </form>
        )}

        {/* Register form */}
        {mode === "register" && (
          <form onSubmit={handleRegister} noValidate style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {step === 1 && (
              <>
                <div className="form-group">
                  <label htmlFor="reg-employeeId" className="form-label">Operator ID</label>
                  <input
                    id="reg-employeeId"
                    type="text"
                    name="employeeId"
                    className="form-input"
                    placeholder="EMP-001"
                    required
                    autoFocus
                    disabled={isPending}
                    style={fieldErrors.employeeId ? { borderColor: "var(--error)" } : undefined}
                    onChange={() => setFieldErrors((prev) => ({ ...prev, employeeId: "" }))}
                    onFocus={() => setError(null)}
                  />
                  {fieldErrors.employeeId && (
                    <div style={{ color: "var(--error)", fontSize: "12px", marginTop: "4px", textAlign: "left" }}>
                      {fieldErrors.employeeId}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="reg-name" className="form-label">Enter Full Name</label>
                  <input
                    id="reg-name"
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Alex Carter"
                    required
                    disabled={isPending}
                    style={fieldErrors.name ? { borderColor: "var(--error)" } : undefined}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length > 0 && val.length < 2) {
                        setFieldErrors((prev) => ({ ...prev, name: "Name must be at least 2 characters" }));
                      } else {
                        setFieldErrors((prev) => ({ ...prev, name: "" }));
                      }
                    }}
                    onFocus={() => setError(null)}
                  />
                  {fieldErrors.name && (
                    <div style={{ color: "var(--error)", fontSize: "12px", marginTop: "4px", textAlign: "left" }}>
                      {fieldErrors.name}
                    </div>
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="form-group">
                  <label htmlFor="reg-email" className="form-label">Enter Email</label>
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="alex@securegate.io"
                    required
                    disabled={isPending}
                    style={fieldErrors.email ? { borderColor: "var(--error)" } : undefined}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                        setFieldErrors((prev) => ({ ...prev, email: "Enter a valid email address" }));
                      } else {
                        setFieldErrors((prev) => ({ ...prev, email: "" }));
                      }
                    }}
                    onFocus={() => setError(null)}
                  />
                  {fieldErrors.email && (
                    <div style={{ color: "var(--error)", fontSize: "12px", marginTop: "4px", textAlign: "left" }}>
                      {fieldErrors.email}
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: "16px" }}>
                  <label htmlFor="reg-password" className="form-label">Choose Password</label>
                  <input
                    id="reg-password"
                    type="password"
                    name="password"
                    className="form-input"
                    placeholder="••••••••••••"
                    required
                    disabled={isPending}
                    style={fieldErrors.password ? { borderColor: "var(--error)" } : undefined}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length === 0) {
                        setFieldErrors((prev) => ({ ...prev, password: "" }));
                      } else if (val.length < 8) {
                        setFieldErrors((prev) => ({ ...prev, password: "Must be at least 8 characters" }));
                      } else if (!/[A-Z]/.test(val)) {
                        setFieldErrors((prev) => ({ ...prev, password: "Must contain an uppercase letter" }));
                      } else if (!/[a-z]/.test(val)) {
                        setFieldErrors((prev) => ({ ...prev, password: "Must contain a lowercase letter" }));
                      } else if (!/[0-9]/.test(val)) {
                        setFieldErrors((prev) => ({ ...prev, password: "Must contain a number" }));
                      } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val)) {
                        setFieldErrors((prev) => ({ ...prev, password: "Must contain a special character" }));
                      } else {
                        setFieldErrors((prev) => ({ ...prev, password: "" }));
                      }
                    }}
                    onFocus={() => setError(null)}
                  />
                  {fieldErrors.password && (
                    <div style={{ color: "var(--error)", fontSize: "12px", marginTop: "4px", textAlign: "left" }}>
                      {fieldErrors.password}
                    </div>
                  )}
                </div>
              </>
            )}

            {error && (
              <div style={{
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--error-glow)",
                border: "1px solid rgba(244, 63, 94, 0.15)",
                color: "var(--error)",
                fontSize: "13px",
                fontWeight: "500",
                lineHeight: "1.4"
              }}>
                ⚠️ {error}
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
                lineHeight: "1.4"
              }}>
                ✓ {success}
              </div>
            )}

            {step === 1 && (
              <button
                type="button"
                className="btn-primary"
                onClick={handleNext}
                style={{ width: "100%", padding: "14px" }}
              >
                Next →
              </button>
            )}

            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isPending}
                style={{ width: "100%", padding: "14px", marginTop: "16px" }}
                >
                  {isPending ? "Creating Account..." : "Create Account"}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep(1); setFieldErrors({}); }}
                  disabled={isPending}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--brand-primary)",
                    fontWeight: "600",
                    fontSize: "13px",
                    padding: "8px 0",
                    transition: "var(--transition-fast)",
                    textAlign: "center"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--brand-secondary)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--brand-primary)"}
                >
                  Back
                </button>
              </div>
            )}
          </form>
        )}

        <footer style={{ textAlign: "center", fontSize: "13px", color: "var(--text-secondary)" }}>
          {mode === "login" ? (
            <>Need access?{" "}
              <button
                type="button"
                onClick={switchMode}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--brand-primary)",
                  fontWeight: "600",
                  fontSize: "13px",
                  padding: 0,
                  transition: "var(--transition-fast)"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--brand-secondary)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--brand-primary)"}
              >
                Sign up
              </button>
            </>
          ) : (
            <>Already authorized?{" "}
              <button
                type="button"
                onClick={switchMode}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--brand-primary)",
                  fontWeight: "600",
                  fontSize: "13px",
                  padding: 0,
                  transition: "var(--transition-fast)"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--brand-secondary)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--brand-primary)"}
              >
                Log In here
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthContent />
    </Suspense>
  );
}

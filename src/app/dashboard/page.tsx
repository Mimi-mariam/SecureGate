import React from "react";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  // Redirection backup if middleware is bypassed
  if (!session || !session.user) {
    redirect("/auth");
  }

  if (!(session.user as { emailVerified?: Date | null }).emailVerified) {
    redirect("/auth/verify");
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "40px 20px",
      position: "relative"
    }} className="animate-fade-in">
      <div style={{
        maxWidth: "600px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "28px"
      }}>
        {/* Branding header */}
        <header style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            width: "52px",
            height: "52px",
            borderRadius: "var(--radius-md)",
            background: "linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)",
            boxShadow: "0 8px 24px var(--brand-glow)",
            fontSize: "22px",
            fontWeight: "800",
            color: "#ffffff"
          }}>
            SG
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#ffffff", marginTop: "8px" }}>
            SecureGate Console
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Identity session authorized successfully.
          </p>
        </header>

        {/* User profile panel */}
        <main className="glass-panel" style={{
          padding: "36px",
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        }}>
          <div>
            <h2 style={{ fontSize: "20px", color: "#ffffff", marginBottom: "4px" }}>
              Active Session Details
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              Cryptography session logs and token signature variables.
            </p>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            padding: "20px",
            background: "rgba(5, 8, 17, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.02)",
            borderRadius: "var(--radius-md)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Identity Name:</span>
              <span style={{ color: "#ffffff", fontWeight: "600" }}>{session.user.name || "N/A"}</span>
            </div>
            <hr style={{ border: "0", borderTop: "1px solid rgba(255, 255, 255, 0.04)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Access Key (Email):</span>
              <span style={{ color: "#ffffff", fontWeight: "600" }}>{session.user.email}</span>
            </div>
            <hr style={{ border: "0", borderTop: "1px solid rgba(255, 255, 255, 0.04)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Cryptographic Signature (ID):</span>
              <span style={{
                color: "var(--brand-primary)",
                fontFamily: "monospace",
                fontSize: "12px",
                fontWeight: "600"
              }}>{session.user.id}</span>
            </div>
            <hr style={{ border: "0", borderTop: "1px solid rgba(255, 255, 255, 0.04)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", alignItems: "center" }}>
              <span style={{ color: "var(--text-secondary)" }}>Authorization Role:</span>
              <span style={{
                fontSize: "11px",
                fontWeight: "700",
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--success-glow)",
                color: "var(--success)",
                border: "1px solid rgba(16, 185, 129, 0.1)"
              }}>{(session.user as { role?: string }).role || "USER"}</span>
            </div>
          </div>

          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/auth" });
          }}>
            <button type="submit" className="btn-secondary" style={{ width: "100%", padding: "14px" }}>
              Revoke Session (Sign Out)
            </button>
          </form>
        </main>

        <footer style={{ textAlign: "center", fontSize: "12px", color: "var(--text-muted)" }}>
          SecureGate Authentication Console &bull; Session Hashed via JWT
        </footer>
      </div>
    </div>
  );
}

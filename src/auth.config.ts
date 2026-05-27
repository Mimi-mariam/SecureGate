import type { NextAuthConfig } from "next-auth";


export const authConfig = {
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isVerified = !!(auth?.user as { emailVerified?: Date | null })?.emailVerified;
      
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnVerify = nextUrl.pathname.startsWith("/auth/verify");
      const isOnAuth = nextUrl.pathname === "/auth";

      if (isLoggedIn) {
        if (isVerified) {
          // Verified users must not access verification or auth pages
          if (isOnVerify || isOnAuth) {
            return Response.redirect(new URL("/dashboard", nextUrl));
          }
          return true;
        } else {
          // Unverified users must go to verify page, except if they are already on it
          if (isOnDashboard || isOnAuth) {
            return Response.redirect(new URL("/auth/verify", nextUrl));
          }
          return true;
        }
      } else {
        // Unauthenticated users can only access the auth page
        if (isOnDashboard || isOnVerify) {
          const authUrl = new URL("/auth", nextUrl);
          // Preserve verified=true param so the auth page shows a success banner
          if (nextUrl.searchParams.has("verified")) {
            authUrl.searchParams.set("verified", nextUrl.searchParams.get("verified")!);
          }
          return Response.redirect(authUrl);
        }
        return true;
      }
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
        token.emailVerified = (user as { emailVerified?: Date | null }).emailVerified;
      }
      
      // Update JWT token session when client triggers session.update()
      if (trigger === "update" && session) {
        token.emailVerified = session.emailVerified;
      }
      
      return token;
    },
    session({ session, token }) {
      const customUser = session.user as { id?: string; role?: string; emailVerified?: unknown };
      if (token.id && session.user) {
        customUser.id = token.id as string;
      }
      if (token.role && session.user) {
        customUser.role = token.role as string;
      }
      if (session.user) {
        customUser.emailVerified = token.emailVerified;
      }
      return session;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;


import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SecureGate | Enterprise Access & Identity Control Gateway",
  description: "SecureGate is a next-generation identity and authentication gateway providing state-of-the-art protection, OAuth links, and secure credential handling.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="glow-wrapper" />
        {children}
      </body>
    </html>
  );
}

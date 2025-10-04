import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Memory Keeper - Preserve Your Family Stories",
  description: "AI-guided conversations to preserve your grandparents' memories forever",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Clean imports

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Poonamallee Zone Portal",
  description: "Official portal for the Poonamallee Zone to bridge the gap between citizens and local governance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans relative bg-slate-50">
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}

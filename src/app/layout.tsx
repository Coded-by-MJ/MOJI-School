import type { Metadata } from "next";
import { Inter, Anaheim, Alkalami, Chivo_Mono } from "next/font/google";
import "./globals.css";

const anaheim = Anaheim({ subsets: ["latin"], variable: "--font-sans" });
const alkalami = Alkalami({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
});
const chivoMono = Chivo_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "MOJI School Management Dashboard",
  description: "Next.js School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={(anaheim.variable, alkalami.variable, chivoMono.variable)}
      >
        {children}
      </body>
    </html>
  );
}

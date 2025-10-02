import type { Metadata } from "next";
import {  Anaheim, Alkalami, Chivo_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
const anaheim = Anaheim({ subsets: ["latin"], variable: "--font-sans" });
const alkalami = Alkalami({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
});
const chivoMono = Chivo_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "MOJI School",
  description: "MOJI School Management System",
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
        <NextTopLoader color="oklch(0.9645 0.0261 90.0969)" showSpinner={false} />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

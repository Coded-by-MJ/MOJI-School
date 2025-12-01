import type { Metadata } from "next";
import { Anaheim, Alkalami, Chivo_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import Providers from "./providers";
const anaheim = Anaheim({ subsets: ["latin"], variable: "--font-sans" });
const alkalami = Alkalami({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
});
const chivoMono = Chivo_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "MOJI School",
  description:
    "MOJI School is a modern school management platform that streamlines communication and collaboration between administrators, teachers, students, and parents. Manage classes, attendance, results, and announcements all in one place.",
  keywords:
    "school management system, AI-assisted school software, student attendance tracking, online result management, class scheduling, parent teacher communication, modern school dashboard, MOJI School, education management platform, school automation Nigeria",
  metadataBase: new URL("https://moji-school.miracleibharokhonre.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MOJI School – Smart School Management System",
    description:
      "Empower your school with MOJI School — a modern, AI-assisted management platform for classes, attendance, results, and communication. Designed for administrators, teachers, students, and parents.",
    url: "https://moji-school.miracleibharokhonre.com",
    siteName: "MOJI School",
    images: [
      {
        url: "https://www.miracleibharokhonre.com/images/mylogo.png",
        width: 1200,
        height: 630,
        alt: "MOJI School Logo",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MOJI School – Smarter School Management for Everyone",
    description:
      "A modern platform for managing classes, results, attendance, and communication between teachers, students, and parents.",
    images: ["https://www.miracleibharokhonre.com/images/mylogo.png"],
  },
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
        <Providers>
        <NextTopLoader
          color="oklch(0.9645 0.0261 90.0969)"
          showSpinner={false}
        />
        {children}
        <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}

import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | MOJI School",
  description: "Reset your password to access your account.",
  alternates: {
    canonical: "/forgot-password",
  },
  openGraph: {
    title: "Forgot Password | MOJI School",
    description: "Reset your password to access your MOJI School account.",
    url: "https://moji-school.miracleibharokhonre.com/forgot-password",
    siteName: "MOJI School",
    type: "website",
    images: [
      {
        url: "https://www.miracleibharokhonre.com/images/mylogo.png", // Update if you have a specific OG image
        width: 1200,
        height: 630,
        alt: "MOJI School - Forgot Password",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forgot Password | MOJI School",
    description: "Reset your password to access your MOJI School account.",
    images: [
      "https://www.miracleibharokhonre.com/images/mylogo.png", // Update if you have a specific Twitter image
    ],
  },
};

function ForgotPasswordPage() {
  return (
    <section className="grid custom-container grid-cols-1 place-items-center min-h-dvh">
      <ForgotPasswordForm />
    </section>
  );
}
export default ForgotPasswordPage;

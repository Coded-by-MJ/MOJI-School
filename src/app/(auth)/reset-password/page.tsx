import ExpiredLink from "@/components/auth/ExpiredLink";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Otega Clothing Production Company",
  description: "Reset your password to access your account.",
  alternates: {
    canonical: "/reset-password",
  },
  openGraph: {
    title: "Reset Password | Otega Clothing Production Company",
    description: "Reset your password to access your account.",
    url: "https://moji-school.miracleibharokhonre.com/reset-password",
    siteName: "Otega Clothing Production Company",
    type: "website",
    images: [
      {
        url: "https://www.miracleibharokhonre.com/images/mylogo.png",
        width: 1200,
        height: 630,
        alt: "Otega Clothing Production Company - Reset Password",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reset Password | Otega Clothing Production Company",
    description: "Reset your password to access your account.",
    images: ["https://www.miracleibharokhonre.com/images/mylogo.png"],
  },
};

async function ResetPasswordPage({
  searchParams,
}: PageProps<"/reset-password">) {
  const { token, error } = await searchParams;

  return (
    <section className="grid custom-container grid-cols-1 place-items-center min-h-dvh">
      {error || !token ? (
        <ExpiredLink />
      ) : (
        <ResetPasswordForm token={token.toString()} />
      )}
    </section>
  );
}
export default ResetPasswordPage;

import {
  ResetPasswordEmailTemplate,
  WelcomeAccountEmailTemplate,
} from "@/components/global/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL;

const renderError = (error: unknown) => {
  console.error(error);
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("unknown error occurred");
  }
  return {
    message: error instanceof Error ? error.message : "An error occurred",
    type: "error",
  };
};
export const sendResetPasswordEmailAction = async ({
  email,
  firstName,
  link,
}: {
  firstName: string;
  link: string;
  email: string;
}) => {
  try {
    const { error } = await resend.emails.send({
      from: `MOJI SCHOOL <${fromEmail}>`,
      to: email,
      react: ResetPasswordEmailTemplate({
        name: firstName,
        link: link,
      }),
      subject: "Reset Your Password",
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    renderError(error);
    throw new Error("Error sending email");
  }
};

export const sendAccountDetailsEmailAction = async ({
  email,
  name,
  link,
  password,
}: {
  name: string;
  link: string;
  email: string;
  password: string;
}) => {
  try {
    const { error } = await resend.emails.send({
      from: `MOJI SCHOOL <${fromEmail}>`,
      to: email,
      subject: "Welcome to MOJI School — Your Account Details",

      react: WelcomeAccountEmailTemplate({
        name,
        link,
        email,
        password,
      }),
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    renderError(error);
    throw new Error("Error sending email");
  }
};

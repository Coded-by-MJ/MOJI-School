import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;

const renderError = (error: unknown) => {
  if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log("unknown error occurred");
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
      to: [email],
      subject: "Reset Your Password",
      //   react: ResetPasswordEmailTemplate({
      //     name: firstName,
      //     link: link,
      //   }),
      text: "hello",
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    renderError(error);
    throw new Error("Error sending email");
  }
};

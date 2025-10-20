import { CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";

function PasswordResetLinkSent({
  setShowPasswordResetLinkSent,
}: {
  setShowPasswordResetLinkSent: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="w-full max-w-[400px] flex gap-4 flex-col p-6 rounded-[1.25rem] border border-[#E6E8EC80] bg-muted shadow-sm shadow-darker-grey/10">
      <div className="flex flex-col justify-center items-center gap-2">
        <CheckCircle2 className="size-14 text-green-500" />

        <h1 className="text-center text-secondary font-dm text-2xl font-bold">
          Password Reset Link Sent
        </h1>
      </div>
      <p className="text-secondary text-center text-base ">
        {" "}
        We&apos;ve sent a password reset link to your inbox. Please check your
        email and click the link to complete your sign-up.
      </p>
      <div className="text-center text-xs text-light-grey">
        Didn’t receive the email? Be sure to check your spam or junk folder.
        <br />
        <div className="justify-center items-center gap-4 fle">
          <Button
            type="button"
            variant={"link"}
            onClick={() => setShowPasswordResetLinkSent(false)}
            className="text-secondary underline"
          >
            Request New Link
          </Button>{" "}
        </div>
      </div>
    </div>
  );
}
export default PasswordResetLinkSent;

import { TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

function ExpiredLink() {
  return (
    <div className="w-full max-w-[400px] flex gap-4 flex-col p-6 rounded-[1.25rem] border border-[#E6E8EC80] bg-muted shadow-sm">
      <div className="flex flex-col justify-center items-center gap-2">
        <TriangleAlert className="size-14 text-red-500" />

        <h1 className="text-center text-secondary  text-2xl font-bold">
          Link Expired or Invalid
        </h1>
      </div>
      <p className="text-secondary text-center text-base ">
        The password reset link is no longer valid. It may have expired or
        already been used. Please request a new link to reset your password.
      </p>

      <div className="justify-center items-center gap-4 flex">
        <Button
          type="button"
          asChild
          className="text-secondary bg-primary h-11"
        >
          <Link href="/forgot-password">Request New Link</Link>
        </Button>{" "}
      </div>
    </div>
  );
}
export default ExpiredLink;

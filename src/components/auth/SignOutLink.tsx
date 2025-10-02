"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "nextjs-toploader/app";

function SignOutLink({ className }: { className: string }) {
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/sign-in"); // redirect to login page
        },
      },
    });
  };

  return (
    <button className={className} onClick={handleLogout}>
      Sign out
    </button>
  );
}
export default SignOutLink;

import { fetchSession } from "@/lib/users";
import { SessionType } from "@/lib/auth-types";

type SignedInProps = {
  children: React.ReactNode | ((data: SessionType) => React.ReactNode);
};

export async function SignedIn({ children }: SignedInProps) {
  const data = await fetchSession();

  if (!data) return null;

  // if children is a function, pass data
  if (typeof children === "function") {
    return <>{(children as (data: any) => React.ReactNode)(data)}</>;
  }

  return <>{children}</>;
}

type SignedOutProps = {
  children: React.ReactNode 
};

export async function SignedOut({ children }: SignedOutProps) {
  const data = await fetchSession();

  if (data) return null;


  return <>{children}</>;
}


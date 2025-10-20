import { SignedIn, SignedOut } from "@/components/auth/AuthStatusComponent";
import { LogoImage } from "./Logo";
import { Button } from "../ui/button";
import Link from "next/link";
import { SessionType } from "@/lib/auth-types";
import { Route } from "next";

function HeroSection() {
  return (
    <section className="relative  overflow-x-clip flex justify-center items-center min-h-dvh  mx-auto w-full max-w-[1800px]">
      <div className="flex flex-col  z-10 gap-10 max-w-[600px] justify-center items-center p-4 sm:p-6  ">
        <LogoImage />
        <h1 className="text-primary uppercase  relative text-center  text-3xl md:text-4xl font-bold lg:text-5xl ">
          MOJI School Management System
        </h1>

        <SignedOut>
          <Button
            asChild
            className="font-medium font-dm text-base bg-secondary text-primary h-11 rounded-4xl px-6 w-max  hover:border-primary border border-transparent transition-colors hover:bg-secondary hover:text-primary group"
          >
            <Link href={"/sign-in"}>
              <span>Get Started</span>
            </Link>
          </Button>
        </SignedOut>
        <SignedIn>
          {(session: SessionType) => (
            <Button
              asChild
              className="font-medium font-dm text-base bg-secondary text-primary h-11 rounded-4xl px-6 w-max  hover:border-primary border border-transparent transition-colors hover:bg-secondary hover:text-primary group"
            >
              <Link href={`/${session.user?.role}` as Route}>
                <span>Dashboard</span>
              </Link>
            </Button>
          )}
        </SignedIn>
      </div>
    </section>
  );
}
export default HeroSection;

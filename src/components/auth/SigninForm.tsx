"use client";

import Link from "next/link";

import { useRouter } from "nextjs-toploader/app";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { signInSchema, SignInSchemaType } from "@/types/zod-schemas";
import { Input } from "../ui/input";
import { authClient } from "@/lib/auth-client";
import { LogoImage } from "../global/Logo";

function SignInForm() {
  const { push } = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInSchemaType) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: async (ctx) => {
          if (ctx.data.user.isPasswordResetRequired) {
            push("/forgot-password");
            toast.error("Please Reset Your Password First.");
          } else {
            toast.success("Successfully signed in.");
            push(`/${ctx.data.user.role}`);
          }

          setIsLoading(false);
        },
        onError: (ctx) => {
          setIsLoading(false);
          console.log(ctx);
          if (ctx.error.code === "EMAIL_NOT_VERIFIED") {
          } else {
            toast.error(
              ctx.error.message ?? "Something went wrong, try again later."
            );
          }
        },
      }
    );
  };

  return (
    <div className="w-full max-w-[500px] flex gap-6 flex-col p-6 rounded-[1.25rem] border border-[#E6E8EC80] bg-muted shadow-sm ">
      <div className="flex w-full flex-col gap-2">
        <LogoImage isLink />
        <h1 className="text-secondary  font-bold text-2xl">
          Welcome To MOJI School
        </h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full  justify-center  flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-secondary">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email Address"
                    className="h-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start justify-start w-full gap-2">
                <FormLabel className="text-secondary">Password</FormLabel>
                <FormControl>
                  <div className="w-full m-0! aria-invalid:border-destructive focus-within:ring-[3px] focus-within:ring-ring/50 focus-within:border-ring aria-invalid:ring-destructive/20 flex items-center justify-between   rounded-md h-10 px-3 py-1  outline-0 border border-input ">
                    <input
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="flex-grow focus-visible:outline-offset-none border-none focus-visible:ring-none  shadow-none outline-none rounded-none focus-visible:ring-0 pl-0 py-0 placeholder:text-base  text-base  outline-0 border-0  h-full"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="shrink-0 flex items-center justify-center"
                    >
                      {showPassword ? (
                        <EyeOff className="size-[1.125rem] text-secondary" />
                      ) : (
                        <Eye className="size-[1.125rem] text-secondary" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <div className="flex justify-between items-center w-full">
                  <FormMessage className="text-xs " />
                  <Link
                    className=" capitalize ml-auto text-secondary hover:underline text-xs underline-offset-2"
                    href="/forgot-password"
                  >
                    forgot password?
                  </Link>
                </div>
              </FormItem>
            )}
          />

          <Button
            size={"lg"}
            disabled={isLoading}
            className="gap-2 group text-secondary rounded-md h-11 w-full font-bold text-base bg-primary"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="size-5 group-hover:translate-x-4 transition-transform duration-200" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
export default SignInForm;

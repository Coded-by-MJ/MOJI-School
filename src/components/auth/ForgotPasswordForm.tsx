"use client";

import Link from "next/link";

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
import { ArrowRight, Loader2 } from "lucide-react";
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "@/types/zod-schemas";
import { Input } from "../ui/input";
import { authClient } from "@/lib/auth-client";
import PasswordResetLinkSent from "./PasswordResetLinkSent";
import { LogoImage } from "../global/Logo";

function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordResetLinkSent, setShowPasswordResetLinkSent] =
    useState(false);

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordSchemaType) => {
    await authClient.requestPasswordReset(
      {
        email: values.email,
        redirectTo: "/reset-password",
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: async () => {
          toast.success("Password Reset Link Sent.");
          setShowPasswordResetLinkSent(true);
        },
        onError: (ctx) => {
          console.log(ctx);

          toast.error(
            ctx.error.message ?? "Something went wrong, try again later."
          );
        },
      }
    );
    setIsLoading(false);
  };

  if (showPasswordResetLinkSent)
    return (
      <PasswordResetLinkSent
        setShowPasswordResetLinkSent={setShowPasswordResetLinkSent}
      />
    );

  return (
    <div className="w-full max-w-[500px] flex gap-8 flex-col p-6 rounded-[1.25rem] border border-[#E6E8EC80] bg-muted shadow-sm ">
      <div className="flex w-full flex-col gap-2">
        <LogoImage isLink />
        <h1 className="text-secondary font-bold text-2xl"> Forgot Password</h1>
        <p className="text-sm text-secondary/80">
          {" "}
          Enter your email address and we will send you a link to reset your
          password
        </p>
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

          <Button
            size={"lg"}
            disabled={isLoading}
            className="gap-2 group text-secondary h-11 w-full font-bold text-base bg-primary"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="size-5 group-hover:translate-x-4 transition-transform duration-200" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
export default ForgotPasswordForm;

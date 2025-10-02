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
import {
  resetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/types/zod-schemas";
import { authClient } from "@/lib/auth-client";
import ExpiredLink from "./ExpiredLink";

function ResetPasswordForm({ token }: { token: string }) {
  const { push } = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showInValid, setShowInValid] = useState(false);

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordSchemaType) => {
    await authClient.resetPassword(
      {
        token: token,
        newPassword: values.newPassword,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: async () => {
          toast.success("Password Reset Successfully.");
          push("/sign-in");
        },
        onError: (ctx) => {
          console.log(ctx);
          if (ctx.error.code === "INVALID_TOKEN") {
            setShowInValid(true);
          } else {
            toast.error(
              ctx.error.message ?? "Something went wrong, try again later."
            );
          }
        },
      }
    );
    setIsLoading(false);
  };

  if (showInValid) return <ExpiredLink />;

  return (
    <div className="w-full max-w-[500px] flex gap-8 flex-col p-6 rounded-[1.25rem] border border-[#E6E8EC80] bg-muted shadow-sm">
      <div className="flex w-full flex-col gap-2">
        <h1 className="text-secondary font-dm font-bold text-2xl">
          {" "}
          Reset Password
        </h1>
        <p className="text-sm text-secondary/20">
          {" "}
          Enter your new password to reset your password
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full  justify-center  flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start justify-start w-full gap-2">
                <FormLabel className="text-secondary">New Password</FormLabel>
                <FormControl>
                  <div className="w-full m-0! aria-invalid:border-destructive focus-within:ring-[3px] focus-within:ring-ring/50 focus-within:border-ring aria-invalid:ring-destructive/20 flex items-center justify-between   rounded-md h-10 px-3 py-1  outline-0 border border-input ">
                    <input
                      placeholder="New Password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="flex-grow focus-visible:outline-offset-none border-none focus-visible:ring-none  shadow-none outline-none rounded-none focus-visible:ring-0 pl-0 py-0 placeholder:text-sm  text-sm  outline-0 border-0  h-full"
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
                <FormMessage className="text-xs " />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start justify-start w-full gap-2">
                <FormLabel className="text-secondary">
                  {" "}
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="w-full m-0! aria-invalid:border-destructive focus-within:ring-[3px] focus-within:ring-ring/50 focus-within:border-ring aria-invalid:ring-destructive/20 flex items-center justify-between   rounded-md h-10 px-3 py-1  outline-0 border border-input ">
                    <input
                      placeholder="Confirm Password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="flex-grow focus-visible:outline-offset-none border-none focus-visible:ring-none  shadow-none outline-none rounded-none focus-visible:ring-0 pl-0 py-0 placeholder:text-sm  text-sm  outline-0 border-0  h-full"
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
                <FormMessage className="text-xs " />
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
                <span>Reset Password</span>
                <ArrowRight className="size-5 group-hover:translate-x-4 transition-transform duration-200" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
export default ResetPasswordForm;

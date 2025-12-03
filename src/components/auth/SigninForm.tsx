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
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  GraduationCap,
  UserCircle,
  Users,
} from "lucide-react";
import { signInSchema, SignInSchemaType } from "@/types/zod-schemas";
import { Input } from "../ui/input";
import { authClient } from "@/lib/auth-client";
import { LogoImage } from "../global/Logo";
import { demoUsers } from "@/utils/options";
import { Badge } from "../ui/badge";

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

  const handleDemoSignIn = async (
    email: string,
    password: string,
    role: string
  ) => {
    setIsLoading(true);
    form.setValue("email", email);
    form.setValue("password", password);

    await authClient.signIn.email(
      {
        email,
        password,
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
            toast.success(`Successfully signed in as ${role}.`);
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

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "teacher":
        return <GraduationCap className="size-5" />;
      case "student":
        return <UserCircle className="size-5" />;
      case "parent":
        return <Users className="size-5" />;
      default:
        return <UserCircle className="size-5" />;
    }
  };

  return (
    <div className="w-full max-w-[500px] flex gap-6 py-10 flex-col">
      <div className="w-full flex gap-6 flex-col p-6 rounded-[1.25rem] border border-[#E6E8EC80] bg-muted shadow-sm">
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

      {/* Demo Users Card */}
      <div className="w-full p-6 rounded-[1.25rem] border border-[#E6E8EC80] bg-muted shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-secondary font-semibold text-lg">
              Test as Guest User
            </h2>
            <p className="text-sm text-muted-foreground">
              Click on any role below to sign in with demo credentials
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {demoUsers.map((demoUser) => (
              <Button
                key={demoUser.email}
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() =>
                  handleDemoSignIn(
                    demoUser.email,
                    demoUser.password,
                    demoUser.role
                  )
                }
                className="w-full justify-start gap-3 h-auto py-3 px-4 hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
                  {getRoleIcon(demoUser.role)}
                </div>
                <div className="flex flex-col items-start flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-secondary capitalize">
                      {demoUser.role}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      Demo
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {demoUser.email}
                  </span>
                </div>
                <ArrowRight className="size-4 text-muted-foreground ml-auto" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignInForm;

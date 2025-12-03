"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BadgeCheck, UploadCloud } from "lucide-react";
import Image from "next/image";
import { getDefaultImage } from "@/utils/funcs";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersMutations } from "@/queries/users";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { profileFormSchema, ProfileFormSchemaType } from "@/types/zod-schemas";
import { useState } from "react";
import { UserRole } from "@/generated/prisma";

type ProfileFormValues = ProfileFormSchemaType;

type Props = {
  name: string;
  image: string | null | undefined;
  role: UserRole ;
  email: string;
};

function ProfileClient({ name, image, role, email }: Props) {
  const queryClient = useQueryClient();
  const firstName = name.split(" ")[0];
  const lastName = name.split(" ")[1] || "";
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const imageUrl = previewImage || image || getDefaultImage(name);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName,
      lastName,
      img: undefined,
    },
  });

  const updateMutation = useMutation({
    mutationFn: usersMutations.updateProfile,
    onSuccess: (data) => {
      toast[data.type](data.message);
      if (data.type === "success") {
        // Invalidate any queries that might depend on user data
        queryClient.invalidateQueries({ queryKey: ["user"] });
        // Reset preview image after successful update
        setPreviewImage(null);
        // Note: We can't directly update the server component's data,
        // but the page will refetch on next navigation
      }
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    updateMutation.mutate(values);
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <div className="flex items-center justify-center w-full py-4">
      <Card className="p-4 w-full max-w-[600px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex-col flex gap-4"
          >
            {/* Profile Image Section with Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Image
                  src={imageUrl}
                  alt={name}
                  width={150}
                  height={150}
                  priority
                  placeholder="empty"
                  className="rounded-full object-cover object-center size-[150px]"
                />
                <FormField
                  control={form.control}
                  name="img"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="absolute bottom-0 right-0">
                          <label
                            htmlFor="profile-img"
                            className="flex items-center justify-center cursor-pointer bg-primary text-secondary rounded-full p-2 hover:bg-primary/90 transition-colors"
                            title="Change profile picture"
                          >
                            <UploadCloud size={20} />
                            <input
                              id="profile-img"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file =
                                  e.target.files && e.target.files.length > 0
                                    ? e.target.files[0]
                                    : null;
                                field.onChange(file);
                                handleImageChange(file);
                              }}
                            />
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div
                className={cn(
                  "text-xs w-[170px] bg-primary flex gap-1 justify-center items-center p-1.5 rounded-2xl border border-current font-medium"
                )}
              >
                <BadgeCheck className="size-5 text-inherit" />
                <span className="font-bold uppercase text-nowrap">{role}</span>
              </div>
            </div>

            <div className="flex flex-col w-full gap-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col gap-2">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Your First Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col gap-2">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Your Last Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormItem className="w-full flex flex-col gap-2">
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  readOnly={true}
                  placeholder="Enter your email address"
                  defaultValue={email}
                />
              </FormItem>

              <Button
                type="submit"
                className="h-12 bg-primary text-secondary w-full"
                disabled={updateMutation.isPending}
              >
                <span>
                  {updateMutation.isPending ? "Updating..." : "Update"}
                </span>
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default ProfileClient;

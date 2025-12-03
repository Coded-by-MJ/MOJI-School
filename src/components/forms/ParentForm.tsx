"use client";

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
import { Input } from "@/components/ui/input";

import { parentFormSchema, ParentFormSchemaType } from "@/types/zod-schemas";
import { UploadCloud } from "lucide-react";
import { extractOrJoinName } from "@/utils/funcs";
import { toast } from "sonner";
import { parentsMutations } from "@/queries/parents";
import { ParentTableDataType } from "@/types";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const ParentForm = ({
  type,
  data,
  onClose,
}: {
  type: "create" | "update";
  data?: Partial<ParentTableDataType>;
  onClose: () => void;
}) => {
  const form = useForm<ParentFormSchemaType>({
    resolver: zodResolver(parentFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName: data?.user ? extractOrJoinName(data?.user.name)[0] : "",
      lastName: data?.user ? extractOrJoinName(data?.user.name)[1] : "",
      email: data?.user ? data?.user.email : "",
      phone: data?.phone || "",
      address: data?.address || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: parentsMutations.create,
    onSettled: (_, __, ___, ____, mutationContext) => {
      mutationContext.client.invalidateQueries({ queryKey: ["parents"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: parentsMutations.update,
    onSettled: (_, __, variables, ___, mutationContext) => {
      mutationContext.client.invalidateQueries({ queryKey: ["parents"] });
      mutationContext.client.invalidateQueries({
        queryKey: ["parent-students", variables.userId],
      });
    },
  });

  const onSubmit = (values: ParentFormSchemaType) => {
    if (type === "create") {
      createMutation.mutate(values, {
        onSuccess: (data) => {
          toast[data.type](data.message);
          if (data.type === "success") {
            onClose();
          }
        },
      });
    } else {
      if (data && data.userId) {
        updateMutation.mutate(
          { userId: data.userId, data: values },
          {
            onSuccess: (data) => {
              toast[data.type](data.message);
              if (data.type === "success") {
                onClose();
              }
            },
          }
        );
      }
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8"
      >
        {/* Personal */}
        <span className="text-xs text-secondary/80 font-medium">
          Parent Information
        </span>
        <div className="flex justify-between w-full flex-wrap gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    readOnly={type === "update"}
                    className="read-only:cursor-not-allowed read-only:opacity-50"
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Upload */}
          <FormField
            control={form.control}
            name="img"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Upload Photo</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="img"
                      className="flex items-center gap-2 cursor-pointer text-sm text-primary"
                    >
                      <UploadCloud size={24} />
                      <span>{field.value ? field.value.name : "Upload"}</span>
                    </label>
                    <input
                      id="img"
                      type="file"
                      accept="image/*"
                      hidden
                      className="invisible"
                      onChange={(e) => {
                        const file =
                          e.target.files && e.target.files.length > 0
                            ? e.target.files[0]
                            : null;
                        field.onChange(file);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="bg-primary text-secondary"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <span>{type === "create" ? "Create" : "Update"}</span>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ParentForm;

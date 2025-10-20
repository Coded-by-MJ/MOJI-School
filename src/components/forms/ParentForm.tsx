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
import { extractOrJoinName, renderClientError } from "@/utils/funcs";
import { toast } from "sonner";
import { createParent, updateParent } from "@/lib/mutation-actions";
import { useState } from "react";
import { ParentTableDataType } from "@/types";
import { Loader2 } from "lucide-react";

const ParentForm = ({
  type,
  data,
  onClose,
}: {
  type: "create" | "update";
  data?: Partial<ParentTableDataType>;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCreate = async (values: ParentFormSchemaType) => {
    setIsLoading(true);

    try {
      const msg = await createParent(values);
      toast[msg.type](msg.message);
      if (msg.type === "success") {
        onClose();
      }
    } catch (error) {
      renderClientError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (values: ParentFormSchemaType) => {
    setIsLoading(true);
    try {
      if (data && data.userId) {
        const msg = await updateParent(data?.userId, values);
        toast[msg.type](msg.message);
        if (msg.type === "success") {
          onClose();
        }
      }
    } catch (error) {
      renderClientError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (values: ParentFormSchemaType) => {
    if (type === "create") {
      handleCreate(values);
    } else {
      handleUpdate(values);
    }
  };

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
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] ?? null)
                      }
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

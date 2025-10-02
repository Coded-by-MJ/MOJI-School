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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StudentOrTeacherFormSchemaType,
  studentOrTeacherFormSchema,
} from "@/types/zod-schemas";
import { UploadCloud } from "lucide-react";

const LessonForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: Partial<StudentOrTeacherFormSchemaType>;
}) => {
  const form = useForm<StudentOrTeacherFormSchemaType>({
    resolver: zodResolver(studentOrTeacherFormSchema),
    defaultValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
      phone: data?.phone || "",
      address: data?.address || "",
      bloodType: data?.bloodType || "",
      birthday: data?.birthday || "",
      sex: data?.sex || "male",
    },
  });

  const onSubmit = (values: StudentOrTeacherFormSchemaType) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8"
      >
        {/* Personal Section */}
        <span className="text-xs text-gray-400 font-medium">
          Student Information
        </span>
        <div className="flex justify-between flex-wrap gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full md:w-[30%]">
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
              <FormItem className="w-full md:w-[30%]">
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
              <FormItem className="w-full md:w-[30%]">
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
              <FormItem className="w-full md:w-[30%]">
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
              <FormItem className="w-full md:w-[30%]">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem className="w-full md:w-[30%]">
                <FormLabel>Birthday</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bloodType"
            render={({ field }) => (
              <FormItem className="w-full md:w-[30%]">
                <FormLabel>Blood Type</FormLabel>
                <FormControl>
                  <Input placeholder="Blood type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem className="w-full md:w-[30%]">
                <FormLabel>Sex</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Upload */}
          <FormField
            control={form.control}
            name="img"
            render={({ field }) => (
              <FormItem className="w-full md:w-[30%]">
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

        <Button type="submit" className="bg-primary text-secondary">
          {type === "create" ? "Create" : "Update"}
        </Button>
      </form>
    </Form>
  );
};

export default LessonForm;

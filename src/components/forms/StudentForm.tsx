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
import { studentFormSchema, StudentFormSchemaType } from "@/types/zod-schemas";
import { UploadCloud } from "lucide-react";
import { extractOrJoinName, renderClientError } from "@/utils/funcs";
import { toast } from "sonner";
import { createStudent, updateStudent } from "@/lib/mutation-actions";
import { useState } from "react";
import { StudentTableDataType, StudentTableRelativeData } from "@/types";
import { Loader2 } from "lucide-react";

const StudentForm = ({
  type,
  data,
  relativeData,
  onClose,
}: {
  type: "create" | "update";
  data?: Partial<StudentTableDataType>;
  relativeData?: StudentTableRelativeData;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const grades = relativeData?.grades || [];
  const parents = relativeData?.parents || [];
  const classes = relativeData?.classes || [];

  const form = useForm<StudentFormSchemaType>({
    resolver: zodResolver(studentFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName: data?.user ? extractOrJoinName(data?.user.name)[0] : "",
      lastName: data?.user ? extractOrJoinName(data?.user.name)[1] : "",
      email: data?.user ? data?.user.email : "",
      phone: data?.phone || "",
      address: data?.address || "",
      bloodType: data?.bloodType,
      birthday: data?.birthday ? new Date(data?.birthday) : undefined,
      sex: data?.sex || "MALE",
    },
  });

  const handleCreate = async (values: StudentFormSchemaType) => {
    setIsLoading(true);

    try {
      const msg = await createStudent(values);
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

  const handleUpdate = async (values: StudentFormSchemaType) => {
    setIsLoading(true);
    const name = extractOrJoinName([values.firstName, values.lastName]);
    try {
      if (data && data.userId) {
        const msg = await updateStudent(data?.userId, values);
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

  const onSubmit = (values: StudentFormSchemaType) => {
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
        className="flex w-full flex-col gap-8"
      >
        {/* Personal */}
        <span className="text-xs text-secondary/80 font-medium">
          Student Information
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
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Birthday</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={
                      field.value
                        ? field.value.toISOString().split("T")[0]
                        : undefined
                    }
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bloodType"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
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
              <FormItem className="w-[45%] md:w-[30%]">
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
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Parent</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {parents.map((parent) => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="classId"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Class</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        ({classItem.name} -{" "}
                        {classItem._count.students + "/" + classItem.capacity}{" "}
                        Capacity)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="gradeId"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Grade</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade.id} value={grade.id}>
                        {grade.level}
                      </SelectItem>
                    ))}
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

export default StudentForm;

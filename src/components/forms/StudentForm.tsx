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
import { extractOrJoinName } from "@/utils/funcs";
import { toast } from "sonner";
import { studentsMutations } from "@/queries/students";
import { StudentTableDataType, StudentTableRelativeData } from "@/types";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

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
  const grades = relativeData?.grades || [];
  const parents = relativeData?.parents || [];
  const classes = relativeData?.classes || [];

  const form = useForm({
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
      parentId: data?.parentId || "",
      classId: data?.classId || "",
      gradeId: data?.gradeId || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: studentsMutations.create,
    onSettled: (_, __, variables, ____, mutationContext) => {
      mutationContext.client.invalidateQueries({ queryKey: ["students"] });
      // Invalidate parent's students list if parentId exists
      if (variables.parentId) {
        mutationContext.client.invalidateQueries({
          queryKey: ["parent-students", variables.parentId],
        });
      }
      // Invalidate class schedule if classId exists
      if (variables.classId) {
        mutationContext.client.invalidateQueries({
          queryKey: ["class-schedule", variables.classId],
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: studentsMutations.update,
    onSettled: (_, __, variables, ____, mutationContext) => {
      mutationContext.client.invalidateQueries({ queryKey: ["students"] });
      // Use student's id (not userId) for query key since the page uses studentId
      // The route /list/students/[studentId] uses student.id, not user.id
      if (data?.id) {
        mutationContext.client.invalidateQueries({
          queryKey: ["student", data.id],
        });
        mutationContext.client.invalidateQueries({
          queryKey: ["student-class", data.id],
        });
      }
      // Invalidate parent's students list - check both old and new parentId
      if (data?.parentId) {
        mutationContext.client.invalidateQueries({
          queryKey: ["parent-students", data.parentId],
        });
      }
      if (
        variables.data.parentId &&
        variables.data.parentId !== data?.parentId
      ) {
        mutationContext.client.invalidateQueries({
          queryKey: ["parent-students", variables.data.parentId],
        });
      }
      // Invalidate class schedules if classId changed
      if (data?.classId) {
        mutationContext.client.invalidateQueries({
          queryKey: ["class-schedule", data.classId],
        });
      }
      if (variables.data.classId && variables.data.classId !== data?.classId) {
        mutationContext.client.invalidateQueries({
          queryKey: ["class-schedule", variables.data.classId],
        });
      }
    },
  });

  const onSubmit = (values: StudentFormSchemaType) => {
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
                        ? (field.value as Date).toISOString().split("T")[0]
                        : undefined
                    }
                    onChange={(e) => field.onChange( e.target.value ? new Date(e.target.value) : undefined)}
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

export default StudentForm;

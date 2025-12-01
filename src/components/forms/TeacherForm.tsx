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
import { teacherFormSchema, TeacherFormSchemaType } from "@/types/zod-schemas";
import { UploadCloud } from "lucide-react";
import { extractOrJoinName } from "@/utils/funcs";
import { toast } from "sonner";
import { teachersMutations } from "@/queries/teachers";
import { TeacherTableDataType, TeacherTableRelativeData } from "@/types";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const TeacherForm = ({
  type,
  data,
  onClose,
  relativeData,
}: {
  type: "create" | "update";
  data?: Partial<TeacherTableDataType>;
  onClose: () => void;
  relativeData?: TeacherTableRelativeData;
}) => {
  const selectedSubjects =
    data && data.subjects ? data?.subjects.map((s) => s.id) : [];
  const subjects = relativeData?.subjects || [];

  const form = useForm({
    resolver: zodResolver(teacherFormSchema),
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
      subjects: selectedSubjects,
    },
  });

  const createMutation = useMutation({
    mutationFn: teachersMutations.create,
    onSettled: (_, __, ___, ____, mutationContext) => {
      mutationContext.client.invalidateQueries({ queryKey: ["teachers"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: teachersMutations.update,
    onSettled: (_, __, variables, ___, mutationContext) => {
      mutationContext.client.invalidateQueries({ queryKey: ["teachers"] });
      // Use teacher's id (not userId) for query key since the page uses teacherId
      // The route /list/teachers/[teacherId] uses teacher.id, not user.id
      if (data?.id) {
        mutationContext.client.invalidateQueries({
          queryKey: ["teacher", data.id],
        });
        mutationContext.client.invalidateQueries({
          queryKey: ["teacher-schedule", data.id],
        });
      }
    },
  });

  const onSubmit = (values: TeacherFormSchemaType) => {
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
          Teacher Information
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
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : undefined
                      )
                    }
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
            name="subjects"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <select
                    defaultValue={field.value || []}
                    onChange={(e) => {
                      const selectedValues = Array.from(
                        e.target.selectedOptions,
                        (opt) => opt.value
                      );
                      const prev = field.value || [];

                      // merge both arrays
                      const merged = [...prev, ...selectedValues];

                      // remove any values that appear twice
                      const final = merged.filter(
                        (val, _, arr) =>
                          arr.indexOf(val) === arr.lastIndexOf(val)
                      );

                      field.onChange(final);
                    }}
                    aria-placeholder={"Select"}
                    multiple
                  >
                    {subjects.map((subject) => {
                      const isSelected = field.value?.includes(subject.id);

                      return (
                        <option
                          key={subject.id}
                          value={subject.id}
                          style={{
                            backgroundColor: isSelected ? "#e0f2fe" : "white", // light blue for selected
                            color: isSelected ? "#0369a1" : "#111", // darker text
                            fontWeight: isSelected ? "600" : "400",
                          }}
                        >
                          {subject.name}
                        </option>
                      );
                    })}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
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

export default TeacherForm;

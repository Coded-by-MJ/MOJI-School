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

import { classFormSchema, ClassFormSchemaType } from "@/types/zod-schemas";
import { renderClientError } from "@/utils/funcs";
import { toast } from "sonner";
import { useState } from "react";
import { ClassTableDataType, ClassTableRelativeData } from "@/types";
import { Loader2 } from "lucide-react";
import { createClass, updateClass } from "@/lib/mutation-actions";

const ClassForm = ({
  type,
  data,
  onClose,
  relativeData,
}: {
  type: "create" | "update";
  data?: Partial<ClassTableDataType>;
  relativeData?: ClassTableRelativeData;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(classFormSchema),
    mode: "onChange",
    defaultValues: {
      name: data?.name || "",
      capacity: data?.capacity || 1,
      supervisorId: data?.supervisorId || "",
      gradeId: data?.grade?.id || "",
    },
  });

  const teachers = relativeData?.teachers || [];
  const grades = relativeData?.grades || [];

  const handleCreate = async (values: ClassFormSchemaType) => {
    setIsLoading(true);

    try {
      const msg = await createClass(values);
      toast[msg.type](msg.message);
      onClose();
    } catch (error) {
      renderClientError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (values: ClassFormSchemaType) => {
    setIsLoading(true);

    try {
      const msg = await updateClass(data?.id!, values);
      toast[msg.type](msg.message);
      onClose();
    } catch (error) {
      renderClientError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (values: ClassFormSchemaType) => {
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
          Class Information
        </span>
        <div className="flex justify-between w-full flex-wrap gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Class Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input
                    placeholder="capacity"
                    value={field.value !== undefined ? String(field.value) : ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          />{" "}
          <FormField
            control={form.control}
            name="supervisorId"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Supervisor</FormLabel>
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
                    {teachers.map((teach) => (
                      <SelectItem key={teach.id} value={teach.id}>
                        {teach.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

export default ClassForm;

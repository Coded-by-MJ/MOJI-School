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
import { lessonFormSchema, LessonFormSchemaType } from "@/types/zod-schemas";
import { renderClientError } from "@/utils/funcs";
import { toast } from "sonner";
import { useState } from "react";
import { LessonTableDataType } from "@/types";
import { Loader2 } from "lucide-react";

const LessonForm = ({
  type,
  data,
  onClose,
}: {
  type: "create" | "update";
  data?: Partial<LessonTableDataType>;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LessonFormSchemaType>({
    resolver: zodResolver(lessonFormSchema),
    mode: "onChange",
    defaultValues: {
      name: data?.name,
      day: data?.day,
      startTime: data?.startTime,
      endTime: data?.endTime,
      teacherId: data?.teacherId,
      classId: data?.classId,
      subjectId: data?.subjectId,
    },
  });

  const handleCreate = async (values: LessonFormSchemaType) => {
    setIsLoading(true);

    try {
    } catch (error) {
      renderClientError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (values: LessonFormSchemaType) => {
    setIsLoading(true);

    try {
    } catch (error) {
      renderClientError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (values: LessonFormSchemaType) => {
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
          Lesson Information
        </span>
        <div className="flex justify-between w-full flex-wrap gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Lesson Name</FormLabel>
                <FormControl>
                  <Input placeholder="Lesson name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    value={
                      field.value
                        ? field.value.toISOString().split("T")[1].slice(0, 5)
                        : ""
                    }
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value
                        .split(":")
                        .map(Number);
                      const newDate = new Date();
                      newDate.setHours(hours, minutes, 0, 0);
                      field.onChange(newDate);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    value={
                      field.value
                        ? field.value.toISOString().split("T")[1].slice(0, 5)
                        : ""
                    }
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value
                        .split(":")
                        .map(Number);
                      const newDate = new Date();
                      newDate.setHours(hours, minutes, 0, 0);
                      field.onChange(newDate);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="day"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Day</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MONDAY">Monday</SelectItem>
                    <SelectItem value="TUESDAY">Tuesday</SelectItem>
                    <SelectItem value="WEDNESDAY">Wednesday</SelectItem>
                    <SelectItem value="THURSDAY">Thursday</SelectItem>
                    <SelectItem value="FRIDAY">Friday</SelectItem>
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

export default LessonForm;

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
  attendanceFormSchema,
  AttendanceFormSchemaType,
} from "@/types/zod-schemas";
import { renderClientError } from "@/utils/funcs";
import { toast } from "sonner";
import { useState } from "react";
import { format, parseISO } from "date-fns";

import { AttendanceTableDataType, AttendanceTableRelativeData } from "@/types";
import { Loader2 } from "lucide-react";
import { createAttendance, updateAttendance } from "@/lib/mutation-actions";
import { Checkbox } from "../ui/checkbox";

const AttendanceForm = ({
  type,
  data,
  onClose,
  relativeData,
}: {
  type: "create" | "update";
  data?: Partial<AttendanceTableDataType>;
  relativeData?: AttendanceTableRelativeData;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const lessons = relativeData?.lessons || [];
  const students = relativeData?.students || [];

  const form = useForm({
    resolver: zodResolver(attendanceFormSchema),
    mode: "onChange",
    defaultValues: {
      date: data && data.date ? new Date(data.date).toISOString() : undefined,
      present: data?.present,
      lessonId: data && data.lessonId ? data?.lessonId : undefined,
      studentId: data?.studentId,
    },
  });

  const handleCreate = async (values: AttendanceFormSchemaType) => {
    setIsLoading(true);

    try {
      const msg = await createAttendance(values);
      toast[msg.type](msg.message);
      onClose();
    } catch (error) {
      renderClientError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (values: AttendanceFormSchemaType) => {
    setIsLoading(true);

    try {
      const msg = await updateAttendance(data?.id!, values);
      toast[msg.type](msg.message);
      onClose();
    } catch (error) {
      renderClientError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (values: AttendanceFormSchemaType) => {
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
          Attendance Information
        </span>
        <div className="flex justify-between w-full flex-wrap gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                    value={
                      field.value
                        ? format(
                            parseISO(field.value as string),
                            "yyyy-MM-dd'T'HH:mm"
                          )
                        : ""
                    }
                    onChange={(e) => {
                      const timeValue = e.target.value;
                      if (!timeValue) {
                        field.onChange(undefined);
                        return;
                      }

                      // convert back to UTC ISO string for storage
                      const parsedDate = new Date(timeValue);
                      field.onChange(parsedDate.toISOString());
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="present"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Present ({field.value ? "Yes" : "No"})</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="lessonId"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Lesson</FormLabel>
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
                    {lessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.name}
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
            name="studentId"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Student</FormLabel>
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
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.user.name}
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

export default AttendanceForm;

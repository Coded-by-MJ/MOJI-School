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
import { examFormSchema, ExamFormSchemaType } from "@/types/zod-schemas";
import { renderClientError } from "@/utils/funcs";
import { toast } from "sonner";
import { useState } from "react";
import { format, parseISO } from "date-fns";

import { ExamTableDataType, ExamTableRelativeData } from "@/types";
import { Loader2 } from "lucide-react";
import { createExam, updateExam } from "@/lib/mutation-actions";

const ExamForm = ({
  type,
  data,
  onClose,
  relativeData,
}: {
  type: "create" | "update";
  data?: Partial<ExamTableDataType>;
  relativeData?: ExamTableRelativeData;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const lessons = relativeData?.lessons || [];

  const form = useForm({
    resolver: zodResolver(examFormSchema),
    mode: "onChange",
    defaultValues: {
      title: data?.title,
      startTime:
        data && data.startTime
          ? new Date(data.startTime).toISOString()
          : undefined,
      endTime:
        data && data.endTime ? new Date(data.endTime).toISOString() : undefined,
      lessonId: data?.lessonId,
    },
  });

  const handleCreate = async (values: ExamFormSchemaType) => {
    setIsLoading(true);

    try {
      const msg = await createExam(values);
      toast[msg.type](msg.message);
      onClose();
    } catch (error) {
      renderClientError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (values: ExamFormSchemaType) => {
    setIsLoading(true);

    try {
      const msg = await updateExam(data?.id!, values);
      toast[msg.type](msg.message);
      onClose();
    } catch (error) {
      renderClientError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (values: ExamFormSchemaType) => {
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
          Exam Information
        </span>
        <div className="flex justify-between w-full flex-wrap gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Exam Title" {...field} />
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
            name="endTime"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>End Time</FormLabel>
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

export default ExamForm;

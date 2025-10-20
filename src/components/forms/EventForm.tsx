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
import { eventFormSchema, EventFormSchemaType } from "@/types/zod-schemas";
import { renderClientError } from "@/utils/funcs";
import { toast } from "sonner";
import { useState } from "react";
import { format, parseISO } from "date-fns";

import { EventTableDataType, EventTableRelativeData } from "@/types";
import { Loader2 } from "lucide-react";
import { createEvent, updateEvent } from "@/lib/mutation-actions";

const EventForm = ({
  type,
  data,
  onClose,
  relativeData,
}: {
  type: "create" | "update";
  data?: Partial<EventTableDataType>;
  relativeData?: EventTableRelativeData;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const classes = relativeData?.classes || [];

  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    mode: "onChange",
    defaultValues: {
      title: data?.title,
      description: data?.description,
      startTime:
        data && data.startTime
          ? new Date(data.startTime).toISOString()
          : undefined,
      endTime:
        data && data.endTime ? new Date(data.endTime).toISOString() : undefined,
      classId: data && data.classId ? data?.classId : undefined,
    },
  });

  const handleCreate = async (values: EventFormSchemaType) => {
    setIsLoading(true);

    try {
      const msg = await createEvent(values);
      toast[msg.type](msg.message);
      onClose();
    } catch (error) {
      renderClientError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (values: EventFormSchemaType) => {
    setIsLoading(true);

    try {
      const msg = await updateEvent(data?.id!, values);
      toast[msg.type](msg.message);
      onClose();
    } catch (error) {
      renderClientError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (values: EventFormSchemaType) => {
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
          Event Information
        </span>
        <div className="flex justify-between w-full flex-wrap gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-[45%]  md:w-[30%]">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="write description"
                    className="w-full border rounded-md max-h-30"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
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
          />{" "}
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
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
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

export default EventForm;

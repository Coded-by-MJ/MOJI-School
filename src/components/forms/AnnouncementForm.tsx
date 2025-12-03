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
  announcementFormSchema,
  AnnouncementFormSchemaType,
} from "@/types/zod-schemas";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

import {
  AnnouncementTableDataType,
  AnnouncementTableRelativeData,
} from "@/types";
import { Loader2 } from "lucide-react";
import { announcementsMutations } from "@/queries/announcements";
import { useMutation } from "@tanstack/react-query";

const AnnouncementForm = ({
  type,
  data,
  onClose,
  relativeData,
}: {
  type: "create" | "update";
  data?: Partial<AnnouncementTableDataType>;
  relativeData?: AnnouncementTableRelativeData;
  onClose: () => void;
}) => {
  const classes = relativeData?.classes || [];

  const form = useForm({
    resolver: zodResolver(announcementFormSchema),
    mode: "onChange",
    defaultValues: {
      title: data?.title,
      description: data?.description,
      date: data && data.date ? new Date(data.date).toISOString() : undefined,
      classId: data && data.classId ? data?.classId : undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: announcementsMutations.create,
    onSettled: (_, __, ___, ____, mutationContext) => {
      mutationContext.client.invalidateQueries({ queryKey: ["announcements"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: announcementsMutations.update,
    onSettled: (_, __, variables, ___, mutationContext) => {
      mutationContext.client.invalidateQueries({ queryKey: ["announcements"] });
      mutationContext.client.invalidateQueries({
        queryKey: ["announcement", variables.id],
      });
    },
  });

  const onSubmit = (values: AnnouncementFormSchemaType) => {
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
      if (data?.id) {
        updateMutation.mutate(
          { id: data.id, data: values },
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
          Announcement Information
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
              <FormItem className="w-[45%] md:w-[30%]">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea placeholder="write description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
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

export default AnnouncementForm;

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
import { subjectFormSchema, SubjectFormSchemaType } from "@/types/zod-schemas";
import { UploadCloud } from "lucide-react";
import { SubjectTableDataType } from "@/types";

const SubjectForm = ({
  type,
  data,
  onClose,
}: {
  type: "create" | "update";
  data?: Partial<SubjectTableDataType>;
  onClose: () => void;
}) => {
  const form = useForm<SubjectFormSchemaType>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: data?.name || "",
    },
  });

  const onSubmit = (values: SubjectFormSchemaType) => {
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
          Subject Information
        </span>
        <div className="flex justify-between flex-wrap gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Subject Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
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

export default SubjectForm;

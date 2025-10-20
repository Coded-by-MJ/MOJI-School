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
import { subjectFormSchema, SubjectFormSchemaType } from "@/types/zod-schemas";
import { SubjectTableDataType, SubjectTableRelativeData } from "@/types";
import { createSubject, updateSubject } from "@/lib/mutation-actions";
import { toast } from "sonner";
import { renderClientError } from "@/utils/funcs";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const SubjectForm = ({
  type,
  data,
  onClose,
  relativeData,
}: {
  type: "create" | "update";
  data?: Partial<SubjectTableDataType>;
  onClose: () => void;
  relativeData?: SubjectTableRelativeData;
}) => {
  const selectedTeachers =
    data && data.teachers ? data?.teachers.map((c) => c.id) : [];
  const allTeachers = relativeData?.teachers || [];
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<SubjectFormSchemaType>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: data?.name || "",
      teachers: selectedTeachers,
    },
  });

  const handleCreate = async (values: SubjectFormSchemaType) => {
    setIsLoading(true);

    try {
      const msg = await createSubject(values);
      toast[msg.type](msg.message);
      onClose();
    } catch (error) {
      renderClientError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (values: SubjectFormSchemaType) => {
    setIsLoading(true);

    try {
      const msg = await updateSubject(data?.id!, values);
      toast[msg.type](msg.message);
      onClose();
    } catch (error) {
      renderClientError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (values: SubjectFormSchemaType) => {
    if (type === "create") {
      handleCreate(values);
    } else if (type === "update") {
      handleUpdate(values);
    }
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
        <div className="flex justify-between flex-col gap-4">
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
          <FormField
            control={form.control}
            name="teachers"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Teachers</FormLabel>
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
                    {allTeachers.map((teacher) => {
                      const isSelected = field.value?.includes(teacher.id);

                      return (
                        <option
                          key={teacher.id}
                          value={teacher.id}
                          style={{
                            backgroundColor: isSelected ? "#e0f2fe" : "white", // light blue for selected
                            color: isSelected ? "#0369a1" : "#111", // darker text
                            fontWeight: isSelected ? "600" : "400",
                          }}
                        >
                          {teacher.user.name}
                        </option>
                      );
                    })}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
        </div>

        <Button
          disabled={isLoading}
          type="submit"
          className="bg-primary text-secondary"
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

export default SubjectForm;

"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

import { StudentOrTeacherFormSchemaType } from "@/types/zod-schemas";
import { Plus, Edit, Trash2 } from "lucide-react";
import FormSkeleton from "./FormSkeleton";

const TeacherForm = dynamic(() => import("./TeacherForm"), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

const StudentForm = dynamic(() => import("./StudentForm"), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

type DialogActionType = "update" | "create" | "delete";

type FormDataMap = {
  teacher: Partial<StudentOrTeacherFormSchemaType>;
  student: Partial<StudentOrTeacherFormSchemaType>;
  parent: {}; // if you haven't defined yet
  subject: {};
  class: {};
  lesson: {};
  exam: {};
  assignment: {};
  result: {};
  attendance: {};
  event: {};
  announcement: {};
};

// Make FormDialogProps strongly typed
type FormDialogProps<T extends keyof FormDataMap> = {
  table: T;
  type: DialogActionType;
  data?: FormDataMap[T];
  id?: number;
};

// Define forms with correct typing
const forms: {
  [K in keyof FormDataMap]: (
    type: Exclude<DialogActionType, "delete">,
    data?: FormDataMap[K]
  ) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
  parent: () => <div>Parent form not implemented</div>,
  subject: () => <div>Subject form not implemented</div>,
  class: () => <div>Class form not implemented</div>,
  lesson: () => <div>Lesson form not implemented</div>,
  exam: () => <div>Exam form not implemented</div>,
  assignment: () => <div>Assignment form not implemented</div>,
  result: () => <div>Result form not implemented</div>,
  attendance: () => <div>Attendance form not implemented</div>,
  event: () => <div>Event form not implemented</div>,
  announcement: () => <div>Announcement form not implemented</div>,
};

const renderIcon = (type: DialogActionType) => {
  switch (type) {
    case "create":
      return <Plus className="size-4" />;
    case "update":
      return <Edit className="size-4" />;
    case "delete":
      return <Trash2 className="size-4" />;
  }
};

function FormDialog<T extends keyof FormDataMap>({
  table,
  type,
  data,
  id,
}: FormDialogProps<T>) {
  const Form = () => {
    if (type === "delete" && id) {
      return (
        <form action="" className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <Button className="bg-red-700 text-white py-2 px-4 rounded-md w-max self-center">
            Delete
          </Button>
        </form>
      );
    }

    if (type === "create" || type === "update") {
      return forms[table] ? forms[table](type, data) : <>Form not found!</>;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"icon"}
          className={`flex items-center justify-center rounded-full bg-primary`}
        >
          {renderIcon(type)}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {type} {table}
          </DialogTitle>
        </DialogHeader>
        <Form />
      </DialogContent>
    </Dialog>
  );
}

export default FormDialog;

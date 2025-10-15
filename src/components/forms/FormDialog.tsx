"use client";

import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

import { Plus, Edit, Trash2 } from "lucide-react";
import FormSkeleton from "./FormSkeleton";
import {
  ClassTableDataType,
  ClassTableRelativeData,
  LessonTableDataType,
  LessonTableRelativeData,
  ParentTableDataType,
  StudentTableDataType,
  StudentTableRelativeData,
  SubjectTableDataType,
  SubjectTableRelativeData,
  TeacherTableDataType,
  TeacherTableRelativeData,
} from "@/types";
import { useState } from "react";

const TeacherForm = dynamic(() => import("./TeacherForm"), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

const StudentForm = dynamic(() => import("./StudentForm"), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

const ParentForm = dynamic(() => import("./ParentForm"), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

const SubjectForm = dynamic(() => import("./SubjectForm"), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

const ClassForm = dynamic(() => import("./ClassForm"), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

const LessonForm = dynamic(() => import("./LessonForm"), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

const ExamForm = dynamic(() => import("./ExamForm"), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

const AssignmentForm = dynamic(() => import("./AssignmentForm"), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

const ResultForm = dynamic(() => import("./ResultForm"), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

const AttendanceForm = dynamic(() => import("./AttendanceForm"), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

const EventForm = dynamic(() => import("./EventForm"), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

const AnnouncementForm = dynamic(() => import("./AnnouncementForm"), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

type DialogActionType = "update" | "create" | "delete";

type FormDataMap = {
  teacher: Partial<TeacherTableDataType>;
  student: Partial<StudentTableDataType>;
  parent: Partial<ParentTableDataType>;
  subject: Partial<SubjectTableDataType>;
  class: Partial<ClassTableDataType>;
  lesson: Partial<LessonTableDataType>;
  exam: {};
  assignment: {};
  result: {};
  attendance: {};
  event: {};
  announcement: {};
};

type RelativeDataMap = {
  teacher: TeacherTableRelativeData;
  student: StudentTableRelativeData;
  parent: {};
  subject: SubjectTableRelativeData;
  class: ClassTableRelativeData;
  lesson: LessonTableRelativeData;
  exam: {};
  assignment: {};
  result: {};
  attendance: {};
  event: {};
  announcement: {};
};

type FormDialogProps<T extends keyof FormDataMap> = {
  table: T;
  type: DialogActionType;
  data?: FormDataMap[T];
  relativeData?: RelativeDataMap[T];

  id?: string;
  userId?: string;
};

// Define forms with correct typing
const forms: {
  [K in keyof FormDataMap]: (args: {
    type: Exclude<DialogActionType, "delete">;
    data?: FormDataMap[K];
    relativeData?: RelativeDataMap[K];
    onClose: () => void;
  }) => JSX.Element;
} = {
  teacher: ({ type, data, onClose, relativeData }) => (
    <TeacherForm
      type={type}
      data={data}
      onClose={onClose}
      relativeData={relativeData}
    />
  ),
  student: ({ type, data, onClose, relativeData }) => (
    <StudentForm
      type={type}
      data={data}
      onClose={onClose}
      relativeData={relativeData}
    />
  ),
  parent: ({ type, data, onClose }) => (
    <ParentForm type={type} data={data} onClose={onClose} />
  ),
  subject: ({ type, data, onClose, relativeData }) => (
    <SubjectForm
      type={type}
      data={data}
      onClose={onClose}
      relativeData={relativeData}
    />
  ),
  class: ({ type, data, relativeData, onClose }) => (
    <ClassForm
      type={type}
      data={data}
      relativeData={relativeData}
      onClose={onClose}
    />
  ),
  lesson: ({ type, data, onClose, relativeData }) => (
    <LessonForm type={type} data={data} onClose={onClose} relativeData={relativeData} />
  ),
  exam: ({ type, data }) => <ExamForm type={type} data={data} />,
  assignment: ({ type, data }) => <AssignmentForm type={type} data={data} />,
  result: ({ type, data }) => <ResultForm type={type} data={data} />,
  attendance: ({ type, data }) => <AttendanceForm type={type} data={data} />,
  event: ({ type, data }) => <EventForm type={type} data={data} />,
  announcement: ({ type, data }) => (
    <AnnouncementForm type={type} data={data} />
  ),
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
  relativeData,
  userId,
}: FormDialogProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };
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
      return forms[table] ? (
        forms[table]({ type, data, relativeData, onClose })
      ) : (
        <>Form not found!</>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size={"icon"}
          className={`flex items-center justify-center rounded-full bg-primary`}
        >
          {renderIcon(type)}
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl">
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

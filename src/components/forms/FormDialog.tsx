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
  ActionState,
  AnnouncementTableDataType,
  AnnouncementTableRelativeData,
  AssignmentTableDataType,
  AssignmentTableRelativeData,
  AttendanceTableDataType,
  AttendanceTableRelativeData,
  ClassTableDataType,
  ClassTableRelativeData,
  EventTableDataType,
  EventTableRelativeData,
  ExamTableDataType,
  ExamTableRelativeData,
  LessonTableDataType,
  LessonTableRelativeData,
  ParentTableDataType,
  ResultTableDataType,
  ResultTableRelativeData,
  StudentTableDataType,
  StudentTableRelativeData,
  SubjectTableDataType,
  SubjectTableRelativeData,
  TeacherTableDataType,
  TeacherTableRelativeData,
} from "@/types";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  teachersMutations,
  studentsMutations,
  parentsMutations,
  subjectsMutations,
  classesMutations,
  lessonsMutations,
  examsMutations,
  assignmentsMutations,
  resultsMutations,
  attendancesMutations,
  announcementsMutations,
  eventsMutations,
} from "@/queries";

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
  exam: Partial<ExamTableDataType>;
  assignment: Partial<AssignmentTableDataType>;
  result: Partial<ResultTableDataType>;
  attendance: Partial<AttendanceTableDataType>;
  event: Partial<EventTableDataType>;
  announcement: Partial<AnnouncementTableDataType>;
};

type RelativeDataMap = {
  teacher: TeacherTableRelativeData;
  student: StudentTableRelativeData;
  parent: {};
  subject: SubjectTableRelativeData;
  class: ClassTableRelativeData;
  lesson: LessonTableRelativeData;
  exam: ExamTableRelativeData;
  assignment: AssignmentTableRelativeData;
  result: ResultTableRelativeData;
  attendance: AttendanceTableRelativeData;
  event: EventTableRelativeData;
  announcement: AnnouncementTableRelativeData;
};
const deleteMutationMap = {
  teacher: teachersMutations.delete,
  student: studentsMutations.delete,
  parent: parentsMutations.delete,
  subject: subjectsMutations.delete,
  class: classesMutations.delete,
  exam: examsMutations.delete,
  lesson: lessonsMutations.delete,
  assignment: assignmentsMutations.delete,
  result: resultsMutations.delete,
  attendance: attendancesMutations.delete,
  event: eventsMutations.delete,
  announcement: announcementsMutations.delete,
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
    <LessonForm
      type={type}
      data={data}
      onClose={onClose}
      relativeData={relativeData}
    />
  ),
  exam: ({ type, data, onClose, relativeData }) => (
    <ExamForm
      type={type}
      data={data}
      onClose={onClose}
      relativeData={relativeData}
    />
  ),
  assignment: ({ type, data, onClose, relativeData }) => (
    <AssignmentForm
      type={type}
      data={data}
      onClose={onClose}
      relativeData={relativeData}
    />
  ),
  result: ({ type, data, onClose, relativeData }) => (
    <ResultForm
      type={type}
      data={data}
      relativeData={relativeData}
      onClose={onClose}
    />
  ),
  attendance: ({ type, data, onClose, relativeData }) => (
    <AttendanceForm
      type={type}
      data={data}
      relativeData={relativeData}
      onClose={onClose}
    />
  ),
  event: ({ type, data, onClose, relativeData }) => (
    <EventForm
      type={type}
      data={data}
      relativeData={relativeData}
      onClose={onClose}
    />
  ),
  announcement: ({ type, data, onClose, relativeData }) => (
    <AnnouncementForm
      type={type}
      data={data}
      relativeData={relativeData}
      onClose={onClose}
    />
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

  const deleteMutation = useMutation<
    ActionState,
    unknown,
    { userId?: string; id?: string }
  >({
    mutationFn: async (variables) => {
      const mutationFn = deleteMutationMap[table] as (vars: {
        userId?: string;
        id?: string;
      }) => Promise<ActionState>;
      return await mutationFn(variables);
    },
    onSettled: (_, __, variables, ____, mutationContext) => {
      mutationContext.client.invalidateQueries({ queryKey: [table + "s"] });
      if (table === "teacher" || table === "student" || table === "parent") {
        const deleteId = userId || variables?.userId || variables?.id;
        if (deleteId) {
          mutationContext.client.invalidateQueries({
            queryKey: [table, deleteId],
          });
        }
      }
    },
  });

  const Form = () => {
    if (type === "delete" && (id || userId)) {
      const handleDelete = () => {
        const deleteId = userId || id;
        if (!deleteId) return;

        // For teachers, students, parents - use userId
        // For others - use id
        const variables =
          table === "teacher" || table === "student" || table === "parent"
            ? { userId: deleteId }
            : { id: deleteId };

        deleteMutation.mutate(variables as { userId?: string; id?: string }, {
          onSuccess: (data) => {
            if (data.type === "success") {
              toast.success(data.message);
            } else {
              toast.error(data.message);
            }
            onClose();
          },
        });
      };

      return (
        <div className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <Button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-destructive"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
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

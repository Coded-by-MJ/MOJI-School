"use client";

import { ColumnDef } from "@tanstack/react-table";

import { lessonsData, role } from "@/lib/data";
import { DataTable } from "@/components/global/DataTable";
import FormDialog from "../forms/FormDialog";

type Lesson = {
  id: number;
  class: string;
  subject: string;
  teacher: string;
};

function LessonsTableWrapper() {
  const lessonsActions: ColumnDef<Lesson>[] = ["teacher", "admin"].includes(
    role
  )
    ? [
        {
          header: "Actions",
          id: "actions",
          cell: ({ row }) => {
            return (
              <div className="flex items-center gap-2">
                <FormDialog
                  table="lesson"
                  type="update"
                  data={row.original}
                  id={row.original.id}
                />{" "}
                <FormDialog
                  table="lesson"
                  type="delete"
                  data={row.original}
                  id={row.original.id}
                />
              </div>
            );
          },
        },
      ]
    : [];
  const columns: ColumnDef<Lesson>[] = [
    {
      header: "Subject Name",
      accessorKey: "subject",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <h3 className="font-semibold">{row.original.subject}</h3>
          </div>
        );
      },
    },

    {
      header: "Class",
      accessorKey: "class",
      cell: ({ row }) => {
        return <span>{row.original.class}</span>;
      },
    },

    {
      header: "Teacher",
      accessorKey: "teacher",
      cell: ({ row }) => {
        return <span>{row.original.teacher}</span>;
      },
    },

    ...lessonsActions,
  ];

  return <DataTable columns={columns} data={lessonsData} />;
}
export default LessonsTableWrapper;

"use client";

import { ColumnDef } from "@tanstack/react-table";

import { examsData, role } from "@/lib/data";
import { DataTable } from "@/components/global/DataTable";
import FormDialog from "../forms/FormDialog";

type Exam = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  date: string;
};

function ExamsTableWrapper() {
  const examsActions: ColumnDef<Exam>[] = ["teacher", "admin"].includes(role)
    ? [
        {
          header: "Actions",
          id: "actions",
          cell: ({ row }) => {
            return (
              <div className="flex items-center gap-2">
                <FormDialog
                  table="exam"
                  type="update"
                  data={row.original}
                  id={row.original.id}
                />{" "}
                <FormDialog
                  table="exam"
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
  const columns: ColumnDef<Exam>[] = [
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
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ row }) => {
        return <span>{row.original.date}</span>;
      },
    },
    ...examsActions,
  ];

  return <DataTable columns={columns} data={examsData} />;
}
export default ExamsTableWrapper;

"use client";

import { ColumnDef } from "@tanstack/react-table";

import { resultsData, role } from "@/lib/data";

import { DataTable } from "@/components/global/DataTable";

import FormDialog from "../forms/FormDialog";

type Result = {
  id: number;
  subject: string;
  student: string;
  teacher: string;
  date: string;
  score: number;
  type: string;
};

function ResultsTableWrapper() {
  const resultsActions: ColumnDef<Result>[] = ["teacher", "admin"].includes(
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
                  table="result"
                  type="update"
                  data={row.original}
                  id={row.original.id}
                />{" "}
                <FormDialog
                  table="result"
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
  const columns: ColumnDef<Result>[] = [
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
      header: "Student",
      accessorKey: "student",
      cell: ({ row }) => {
        return <span>{row.original.student}</span>;
      },
    },
    {
      header: "Score",
      accessorKey: "score",
      cell: ({ row }) => {
        return <span>{row.original.score}</span>;
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
    ...resultsActions,
  ];

  return <DataTable columns={columns} data={resultsData} />;
}
export default ResultsTableWrapper;

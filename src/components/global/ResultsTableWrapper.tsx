"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/global/DataTable";

import FormDialog from "../forms/FormDialog";

import { ResultTableDataType, ResultTableRelativeData } from "@/types";
import { ResultType, UserRole } from "@prisma/client";
import { format } from "date-fns";

type Props = {
  data: ResultTableDataType[];
  userRole: UserRole | null;
  relativeData: ResultTableRelativeData;
};

function ResultsTableWrapper({ data, userRole, relativeData }: Props) {
  const resultsActions: ColumnDef<ResultTableDataType>[] = [
    "teacher",
    "admin",
  ].includes(userRole || "")
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
                  relativeData={relativeData}
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
  const columns: ColumnDef<ResultTableDataType>[] = [
    {
      header: "Exam/Assignment Title",
      id: "title",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <h3 className="font-semibold">
              {row.original.type === ResultType.EXAM
                ? row.original.exam?.title || "N/A"
                : row.original?.assignment?.title || "N/A"}
            </h3>
          </div>
        );
      },
    },
    {
      header: "Student",
      accessorKey: "student",
      cell: ({ row }) => {
        return <span>{row.original.student.user.name}</span>;
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
        return (
          <span>
            {row.original.type === ResultType.EXAM
              ? row.original?.exam?.lesson.teacher.user.name || "N/A"
              : row.original?.assignment?.lesson.teacher.user.name || "N/A"}
          </span>
        );
      },
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => {
        return <span>{row.original.type}</span>;
      },
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ row }) => {
        return <span>{format(row.original.createdAt, "MM/dd/yyyy")}</span>;
      },
    },
    ...resultsActions,
  ];

  return <DataTable columns={columns} data={data} />;
}
export default ResultsTableWrapper;

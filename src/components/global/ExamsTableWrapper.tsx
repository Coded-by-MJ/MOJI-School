"use client";

import { ColumnDef } from "@tanstack/react-table";

import { examsData, role } from "@/lib/data";
import { DataTable } from "@/components/global/DataTable";
import FormDialog from "../forms/FormDialog";
import { ExamTableDataType, ExamTableRelativeData } from "@/types";
import { UserRole } from "@/generated/prisma";
import { format } from "date-fns";

type Props = {
  data: ExamTableDataType[];
  userRole: UserRole | null;
  relativeData: ExamTableRelativeData;
};

function ExamsTableWrapper({ data, userRole, relativeData }: Props) {
  const examsActions: ColumnDef<ExamTableDataType>[] = [
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
                  table="exam"
                  type="update"
                  data={row.original}
                  id={row.original.id}
                  relativeData={relativeData}
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
  const columns: ColumnDef<ExamTableDataType>[] = [
    {
      header: "Subject Name",
      accessorKey: "subject",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <h3 className="font-semibold">
              {row.original.lesson.subject.name}
            </h3>
          </div>
        );
      },
    },
    {
      header: "Class",
      accessorKey: "class",
      cell: ({ row }) => {
        return <span>{row.original.lesson.class.name}</span>;
      },
    },

    {
      header: "Teacher",
      accessorKey: "teacher",
      cell: ({ row }) => {
        return <span>{row.original.lesson.teacher.user.name}</span>;
      },
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ row }) => {
        return <span>{format(row.original.startTime, "MM/dd/yyyy")}</span>;
      },
    },
    ...examsActions,
  ];

  return <DataTable columns={columns} data={data} />;
}
export default ExamsTableWrapper;

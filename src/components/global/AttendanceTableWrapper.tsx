"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/global/DataTable";

import FormDialog from "../forms/FormDialog";

import { AttendanceTableDataType, AttendanceTableRelativeData } from "@/types";
import {  UserRole } from "@prisma/client";
import { format } from "date-fns";

type Props = {
  data: AttendanceTableDataType[];
  userRole: UserRole | null;
  relativeData: AttendanceTableRelativeData;
};

function AttendanceTableWrapper({ data, userRole, relativeData }: Props) {
  const attendanceActions: ColumnDef<AttendanceTableDataType>[] = [
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
                  table="attendance"
                  type="update"
                  data={row.original}
                  id={row.original.id}
                  relativeData={relativeData}
                />{" "}
                <FormDialog
                  table="attendance"
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
  const columns: ColumnDef<AttendanceTableDataType>[] = [

    {
      header: "Student",
      accessorKey: "student",
      cell: ({ row }) => {
        return <span>{row.original.student.user.name}</span>;
      },
    },
    {
      header: "Lesson",
      accessorKey: "lesson",
      cell: ({ row }) => {
        return <span>{row.original.lesson.name}</span>;
      },
    },

    {
      header: "Teacher",
      accessorKey: "teacher",
      cell: ({ row }) => {
        return (
          <span>
            {row.original.lesson.teacher.user.name}
          </span>
        );
      },
    },
    {
      header: "Type",
      id: "type",
      cell: ({ row }) => {
        return <span>{row.original.present ? "Present" : "Absent"}</span>;
      },
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ row }) => {
        return <span>{format(row.original.date, "MM/dd/yyyy")}</span>;
      },
    },
    ...attendanceActions,
  ];

  return <DataTable columns={columns} data={data} />;
}
export default AttendanceTableWrapper;

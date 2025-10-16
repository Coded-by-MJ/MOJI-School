"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/global/DataTable";

import FormDialog from "../forms/FormDialog";
import { AssignmentTableDataType, AssignmentTableRelativeData } from "@/types";
import { UserRole } from "@prisma/client";
import { format } from "date-fns";

type Props = {
  data: AssignmentTableDataType[];
  userRole: UserRole | null;
  relativeData: AssignmentTableRelativeData;
};

function AssignmentsTableWrapper({ data, userRole, relativeData }: Props) {
  const assignmentsActions: ColumnDef<AssignmentTableDataType>[] = [
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
                  table="assignment"
                  type="update"
                  data={row.original}
                  id={row.original.id}
                  relativeData={relativeData}
                />{" "}
                <FormDialog
                  table="assignment"
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
  const columns: ColumnDef<AssignmentTableDataType>[] = [
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
      header: "Due Date",
      accessorKey: "dueDate",
      cell: ({ row }) => {
        return <span>{format(row.original.dueDate, "MM/dd/yyyy")}</span>;
      },
    },
    ...assignmentsActions,
  ];

  return <DataTable columns={columns} data={data} />;
}
export default AssignmentsTableWrapper;

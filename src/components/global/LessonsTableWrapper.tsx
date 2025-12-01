"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/global/DataTable";
import FormDialog from "../forms/FormDialog";
import { UserRole } from "@/generated/prisma";
import { LessonTableDataType, LessonTableRelativeData } from "@/types";

type Props = {
  data: LessonTableDataType[];
  userRole: UserRole | null;
  relativeData: LessonTableRelativeData;
};

function LessonsTableWrapper({ data, userRole, relativeData }: Props) {
  const lessonsActions: ColumnDef<LessonTableDataType>[] = [
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
                  table="lesson"
                  type="update"
                  data={row.original}
                  id={row.original.id}
                  relativeData={relativeData}
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
  const columns: ColumnDef<LessonTableDataType>[] = [
    {
      header: "Lesson Name",
      accessorKey: "name",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <h3 className="font-semibold">{row.original.name}</h3>
          </div>
        );
      },
    },

    {
      header: "Teacher",
      accessorKey: "teacher",
      cell: ({ row }) => {
        return <span>{row.original.teacher.user.name}</span>;
      },
    },

    ...lessonsActions,
  ];

  return <DataTable columns={columns} data={data} />;
}
export default LessonsTableWrapper;

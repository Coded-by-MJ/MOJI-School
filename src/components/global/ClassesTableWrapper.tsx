"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/global/DataTable";
import FormDialog from "../forms/FormDialog";
import { ClassTableDataType, ClassTableRelativeData } from "@/types";
import { UserRole } from "@prisma/client";

type Props = {
  data: ClassTableDataType[];
  userRole: UserRole | null;
  relativeData: ClassTableRelativeData;
};

function ClassesTableWrapper({ userRole, data, relativeData }: Props) {
  const classesActions: ColumnDef<ClassTableDataType>[] =
    userRole === "admin"
      ? [
          {
            header: "Actions",
            id: "actions",
            cell: ({ row }) => {
              return (
                <div className="flex items-center gap-2">
                  <FormDialog
                    table="class"
                    type="update"
                    data={row.original}
                    id={row.original.id}
                    relativeData={relativeData}
                  />{" "}
                  <FormDialog
                    table="class"
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

  const columns: ColumnDef<ClassTableDataType>[] = [
    {
      header: "Class Name",
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
      header: "Capacity",
      accessorKey: "capacity",
      cell: ({ row }) => {
        return <span>{row.original.capacity}</span>;
      },
    },

    {
      header: "Grade",
      accessorKey: "grade",
      cell: ({ row }) => {
        return <span>{row.original.grade.level}</span>;
      },
    },

    {
      header: "Supervisors",
      accessorKey: "supervisors",
      cell: ({ row }) => {
        const supervisor = row.original.supervisor ? row.original.supervisor.user.name : "N/A"

        return <span>{supervisor}</span>;
      },
    },

    ...classesActions,
  ];

  return <DataTable columns={columns} data={data} />;
}
export default ClassesTableWrapper;

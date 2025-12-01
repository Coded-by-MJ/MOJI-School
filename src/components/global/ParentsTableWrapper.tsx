"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/global/DataTable";

import FormDialog from "../forms/FormDialog";
import { ParentTableDataType } from "@/types";
import { UserRole } from "@/generated/prisma";

type Props = {
  data: ParentTableDataType[];
  userRole: UserRole | null;
};

function ParentsTableWrapper({ userRole, data }: Props) {
  const parentsActions: ColumnDef<ParentTableDataType>[] =
    userRole === "admin"
      ? [
          {
            header: "Actions",
            id: "actions",
            cell: ({ row }) => {
              return (
                <div className="flex items-center gap-2">
                  <FormDialog
                    table="parent"
                    type="update"
                    data={row.original}
                    id={row.original.id}
                    userId={row.original.userId}
                  />{" "}
                  <FormDialog
                    table="parent"
                    type="delete"
                    data={row.original}
                    id={row.original.id}
                    userId={row.original.userId}
                  />
                </div>
              );
            },
          },
        ]
      : [];
  const columns: ColumnDef<ParentTableDataType>[] = [
    {
      header: "Info",
      id: "info",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <h3 className="font-semibold">{row.original.user.name}</h3>
            <p className="text-xs text-gray-500">{row.original.user.email}</p>
          </div>
        );
      },
    },
    {
      header: "Student Names",
      accessorKey: "students",
      cell: ({ row }) => {
        const allStudents = row.original.students.map((c) => c.user.name);
        return <span>{allStudents.join(", ") || "N/A"}</span>;
      },
    },

    {
      header: "Phone",
      accessorKey: "phone",
      cell: ({ row }) => {
        return <span>{row.original.phone}</span>;
      },
    },
    {
      header: "Address",
      accessorKey: "address",
      cell: ({ row }) => {
        return <span>{row.original.address}</span>;
      },
    },
    ...parentsActions,
  ];

  return <DataTable columns={columns} data={data} />;
}
export default ParentsTableWrapper;

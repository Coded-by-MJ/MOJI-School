"use client";

import { ColumnDef } from "@tanstack/react-table";

import { parentsData, role } from "@/lib/data";

import { DataTable } from "@/components/global/DataTable";

import FormDialog from "../forms/FormDialog";

type Parent = {
  id: number;
  name: string;
  email?: string;
  phone: string;
  students: string[];
  address: string;
};

function ParentsTableWrapper() {
  const parentsActions: ColumnDef<Parent>[] =
    role === "admin"
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
                  />{" "}
                  <FormDialog
                    table="parent"
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
  const columns: ColumnDef<Parent>[] = [
    {
      header: "Info",
      id: "info",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <h3 className="font-semibold">{row.original.name}</h3>
            <p className="text-xs text-gray-500">{row.original?.email}</p>
          </div>
        );
      },
    },
    {
      header: "Student Names",
      accessorKey: "students",
      cell: ({ row }) => {
        return <span>{row.original.students.join(", ")}</span>;
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

  return <DataTable columns={columns} data={parentsData} />;
}
export default ParentsTableWrapper;

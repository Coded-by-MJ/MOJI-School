"use client";

import { ColumnDef } from "@tanstack/react-table";

import { classesData, role } from "@/lib/data";

import { DataTable } from "@/components/global/DataTable";
import FormDialog from "../forms/FormDialog";

type Class = {
  id: number;
  name: string;
  capacity: number;
  grade: number;
  supervisor: string;
};

function ClassesTableWrapper() {
  const classesActions: ColumnDef<Class>[] =
    role === "admin"
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

  const columns: ColumnDef<Class>[] = [
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
        return <span>{row.original.grade}</span>;
      },
    },

    {
      header: "Supervisor",
      accessorKey: "supervisor",
      cell: ({ row }) => {
        return <span>{row.original.supervisor}</span>;
      },
    },

    ...classesActions,
  ];

  return <DataTable columns={columns} data={classesData} />;
}
export default ClassesTableWrapper;

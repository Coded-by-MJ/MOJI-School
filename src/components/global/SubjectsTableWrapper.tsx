"use client";

import { ColumnDef } from "@tanstack/react-table";

import { role, subjectsData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { Route } from "next";
import { DataTable } from "@/components/global/DataTable";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import FormDialog from "../forms/FormDialog";

type Subject = {
  id: number;
  name: string;

  teachers: string[];
};

function SubjectsTableWrapper() {
  const subjectsActions: ColumnDef<Subject>[] =
    role === "admin"
      ? [
          {
            header: "Actions",
            id: "actions",
            cell: ({ row }) => {
              return (
                <div className="flex items-center gap-2">
                  <FormDialog
                    table="subject"
                    type="update"
                    data={row.original}
                    id={row.original.id}
                  />{" "}
                  <FormDialog
                    table="subject"
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

  const columns: ColumnDef<Subject>[] = [
    {
      header: "Subject Name",
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
      header: "Teachers",
      accessorKey: "teachers",
      cell: ({ row }) => {
        return <span>{row.original.teachers.join(", ")}</span>;
      },
    },

    ...subjectsActions,
  ];

  return <DataTable columns={columns} data={subjectsData} />;
}
export default SubjectsTableWrapper;

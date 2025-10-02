"use client";

import { ColumnDef } from "@tanstack/react-table";

import { assignmentsData, examsData, parentsData, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { Route } from "next";
import { DataTable } from "@/components/global/DataTable";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import FormDialog from "../forms/FormDialog";

type Assignment = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  dueDate: string;
};

function AssignmentsTableWrapper() {
    const assignmentsActions: ColumnDef<Assignment>[] = ["teacher", "admin"].includes(
      role
    )
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
  const columns: ColumnDef<Assignment>[] = [
    {
      header: "Subject Name",
      accessorKey: "subject",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <h3 className="font-semibold">{row.original.subject}</h3>
          </div>
        );
      },
    },
    {
      header: "Class",
      accessorKey: "class",
      cell: ({ row }) => {
        return <span>{row.original.class}</span>;
      },
    },

    {
      header: "Teacher",
      accessorKey: "teacher",
      cell: ({ row }) => {
        return <span>{row.original.teacher}</span>;
      },
    },
    {
      header: "Due Date",
      accessorKey: "dueDate",
      cell: ({ row }) => {
        return <span>{row.original.dueDate}</span>;
      },
    },
    ...assignmentsActions,
  ];

  return <DataTable columns={columns} data={assignmentsData} />;
}
export default AssignmentsTableWrapper;

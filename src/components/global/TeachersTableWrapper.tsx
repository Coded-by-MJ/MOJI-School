"use client";

import { ColumnDef } from "@tanstack/react-table";

import { teachersData, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { Route } from "next";
import { DataTable } from "@/components/global/DataTable";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import FormDialog from "../forms/FormDialog";

type Teacher = {
  id: number;
  teacherId: string;
  name: string;
  email?: string;
  photo: string;
  phone: string;
  subjects: string[];
  classes: string[];
  address: string;
};

function TeachersTableWrapper() {
  const columns: ColumnDef<Teacher>[] = [
    {
      header: "Info",
      id: "info",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4">
            <Image
              src={row.original.photo}
              alt={row.original.name}
              width={40}
              height={40}
              className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <h3 className="font-semibold">{row.original.name}</h3>
              <p className="text-xs text-gray-500">{row.original?.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Teacher ID",
      accessorKey: "teacherId",
      cell: ({ row }) => {
        return <span>{row.original.teacherId}</span>;
      },
    },
    {
      header: "Subjects",
      accessorKey: "subjects",
      cell: ({ row }) => {
        return <span>{row.original.subjects.join(", ")}</span>;
      },
    },
    {
      header: "Classes",
      accessorKey: "classes",
      cell: ({ row }) => {
        return <span>{row.original.classes.join(", ")}</span>;
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
    {
      header: "Actions",
      id: "action",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button size={"icon"} className="rounded-full  bg-primary" asChild>
              <Link href={`/list/teachers/${row.original.id}`}>
                <Eye className="size-4" />
              </Link>
            </Button>
            {role === "admin" && (
              <FormDialog table="teacher" type="delete" id={row.original.id} />
            )}
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={teachersData} />;
}
export default TeachersTableWrapper;

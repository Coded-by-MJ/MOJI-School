"use client";

import { ColumnDef } from "@tanstack/react-table";

import { role, studentsData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { Route } from "next";
import { DataTable } from "@/components/global/DataTable";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import FormDialog from "../forms/FormDialog";

type Student = {
  id: number;
  studentId: string;
  name: string;
  email?: string;
  photo: string;
  phone: string;
  class: string;
  grade: number;
  address: string;
};

function StudentsTableWrapper() {
  const columns: ColumnDef<Student>[] = [
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
              <p className="text-xs text-gray-500">{row.original.class}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Student ID",
      accessorKey: "studentId",
      cell: ({ row }) => {
        return <span>{row.original.studentId}</span>;
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
            <Button asChild size={"icon"} className="rounded-full  bg-primary">
              <Link href={`/list/students/${row.original.id}`}>
                <Eye className="size-4" />
              </Link>
            </Button>
            {
              role === "admin" && (
                <FormDialog table="student" type="delete" id={row.original.id} />
              )
            }
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={studentsData} />;
}
export default StudentsTableWrapper;

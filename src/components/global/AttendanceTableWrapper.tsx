"use client";

import { ColumnDef } from "@tanstack/react-table";

import { parentsData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { Route } from "next";
import { DataTable } from "@/components/global/DataTable";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";

type Parent = {
  id: number;
  name: string;
  email?: string;
  phone: string;
  students: string[];
  address: string;
};

function AttendanceTableWrapper() {
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
    {
      header: "Actions",
      id: "action",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button size={"icon"} className="rounded-full  bg-primary">
              <Edit className="size-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={parentsData} />;
}
export default AttendanceTableWrapper;

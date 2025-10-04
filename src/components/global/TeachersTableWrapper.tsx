"use client";

import { ColumnDef } from "@tanstack/react-table";

import Image from "next/image";
import Link from "next/link";
import { DataTable } from "@/components/global/DataTable";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import FormDialog from "../forms/FormDialog";
import { TeacherTableDataType } from "@/types";
import { extractId, getDefaultImage } from "@/utils/funcs";
import AllowedUserCompClient from "../auth/AllowedUserCompClient";

type Props = {
  data: TeacherTableDataType[];
};

function TeachersTableWrapper({ data }: Props) {
  const columns: ColumnDef<TeacherTableDataType>[] = [
    {
      header: "Info",
      id: "info",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4">
            <Image
              src={
                row.original.user.image ||
                getDefaultImage(row.original.user.name)
              }
              alt={row.original.user.name}
              width={40}
              height={40}
              className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <h3 className="font-semibold">{row.original.user.name}</h3>
              <p className="text-xs text-gray-500">{row.original.user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Teacher ID",
      accessorKey: "id",
      cell: ({ row }) => {
        return <span>{extractId(row.original.id)}</span>;
      },
    },
    {
      header: "Subjects",
      accessorKey: "subjects",

      cell: ({ row }) => {
        const allSubjects = row.original.classes.map((c) => c.name);
        return <span>{allSubjects.join(", ") || "N/A"}</span>;
      },
    },
    {
      header: "Classes",
      accessorKey: "classes",
      cell: ({ row }) => {
        const allClasses = row.original.classes.map((c) => c.name);
        return <span>{allClasses.join(", ") || "N/A"}</span>;
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
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button size={"icon"} className="rounded-full  bg-primary" asChild>
              <Link href={`/list/teachers/${row.original.user.id}`}>
                <Eye className="size-4" />
              </Link>
            </Button>

            <AllowedUserCompClient allowedRoles={["admin"]}>
              <FormDialog
                table="teacher"
                type="delete"
                userId={row.original.user.id}
                id={row.original.id}
              />
            </AllowedUserCompClient>
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
export default TeachersTableWrapper;

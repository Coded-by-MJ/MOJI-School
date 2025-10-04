"use client";

import { ColumnDef } from "@tanstack/react-table";

import Image from "next/image";
import Link from "next/link";
import { DataTable } from "@/components/global/DataTable";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import FormDialog from "../forms/FormDialog";
import { StudentTableDataType, StudentTableRelativeData} from "@/types";
import { extractId, getDefaultImage } from "@/utils/funcs";
import AllowedUserCompClient from "../auth/AllowedUserCompClient";

type Props = {
  data: StudentTableDataType[];
   relativeData: StudentTableRelativeData
};

function StudentsTableWrapper({ data }: Props) {
  const columns: ColumnDef<StudentTableDataType>[] = [
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
              <p className="text-xs text-gray-500">{row.original.class.name}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Student ID",
      accessorKey: "id",
      cell: ({ row }) => {
        return <span>{extractId(row.original.id)}</span>;
      },
    },
    {
      header: "Grade",
      accessorKey: "grade.level",
      cell: ({ row }) => {
        return <span>{row.original.grade.level}</span>;
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

            <AllowedUserCompClient allowedRoles={["admin"]}>
              <FormDialog
                table="student"
                type="delete"
                id={row.original.id}
                userId={row.original.userId}
              />
            </AllowedUserCompClient>
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
export default StudentsTableWrapper;

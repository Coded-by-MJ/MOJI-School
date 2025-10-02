"use client";

import { ColumnDef } from "@tanstack/react-table";

import { announcementsData, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { Route } from "next";
import { DataTable } from "@/components/global/DataTable";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import FormDialog from "../forms/FormDialog";

type Announcement = {
  id: number;
  title: string;
  class: string;
  date: string;
};

function AnnouncementsTableWrapper() {
  const announcementsActions: ColumnDef<Announcement>[] =
    role === "admin"
      ? [
          {
            header: "Actions",
            id: "actions",
            cell: ({ row }) => {
              return (
                <div className="flex items-center gap-2">
                  <FormDialog
                    table="announcement"
                    type="update"
                    data={row.original}
                    id={row.original.id}
                  />{" "}
                  <FormDialog
                    table="announcement"
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
  const columns: ColumnDef<Announcement>[] = [
    {
      header: "Title",
      accessorKey: "title",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <h3 className="font-semibold">{row.original.title}</h3>
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
      header: "Date",
      accessorKey: "date",
      cell: ({ row }) => {
        return <span>{row.original.date}</span>;
      },
    },
    ...announcementsActions,
  ];

  return <DataTable columns={columns} data={announcementsData} />;
}
export default AnnouncementsTableWrapper;

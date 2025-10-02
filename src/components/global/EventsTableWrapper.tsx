"use client";

import { ColumnDef } from "@tanstack/react-table";

import { eventsData, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { Route } from "next";
import { DataTable } from "@/components/global/DataTable";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import FormDialog from "../forms/FormDialog";

type Event = {
  id: number;
  title: string;
  class: string;
  date: string;
  startTime: string;
  endTime: string;
};

function EventsTableWrapper() {
  const eventsActions: ColumnDef<Event>[] =
    role === "admin"
      ? [
          {
            header: "Actions",
            id: "actions",
            cell: ({ row }) => {
              return (
                <div className="flex items-center gap-2">
                  <FormDialog
                    table="event"
                    type="update"
                    data={row.original}
                    id={row.original.id}
                  />{" "}
                  <FormDialog
                    table="event"
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
  const columns: ColumnDef<Event>[] = [
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
    {
      header: "Start Time",
      accessorKey: "startTime",
      cell: ({ row }) => {
        return <span>{row.original.startTime}</span>;
      },
    },
    {
      header: "End Time",
      accessorKey: "endTime",
      cell: ({ row }) => {
        return <span>{row.original.endTime}</span>;
      },
    },
    ...eventsActions,
  ];

  return <DataTable columns={columns} data={eventsData} />;
}
export default EventsTableWrapper;

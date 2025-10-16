"use client";

import { ColumnDef } from "@tanstack/react-table";

import { eventsData, role } from "@/lib/data";

import { DataTable } from "@/components/global/DataTable";

import FormDialog from "../forms/FormDialog";


import { EventTableDataType, EventTableRelativeData } from "@/types";
import {  UserRole } from "@prisma/client";
import { format } from "date-fns";

type Props = {
  data: EventTableDataType[];
  userRole: UserRole | null;
  relativeData: EventTableRelativeData;
};

function EventsTableWrapper({ data, userRole, relativeData }: Props) {
  const eventsActions: ColumnDef<EventTableDataType>[] =
    userRole === "admin"
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
                    relativeData={relativeData}
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
  const columns: ColumnDef<EventTableDataType>[] = [
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
        return <span>{row.original.class?.name || "N/A"}</span>;
      },
    },

    {
      header: "Date",
      accessorKey: "date",
      cell: ({ row }) => {
        return <span>{format(new Date(row.original.startTime), "MM/dd/yyyy")}</span>;
      },
    },
    {
      header: "Start Time",
      accessorKey: "startTime",
      cell: ({ row }) => {
        return <span>{format(row.original.startTime, "hh:mm a")}</span>;
      },
    },
    {
      header: "End Time",
      accessorKey: "endTime",
      cell: ({ row }) => {
        return <span>{format(row.original.endTime, "hh:mm a")}</span>;
      },
    },
    ...eventsActions,
  ];

  return <DataTable columns={columns} data={data} />;
}
export default EventsTableWrapper;

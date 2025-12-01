"use client";

import { ColumnDef } from "@tanstack/react-table";

import { announcementsData, role } from "@/lib/data";

import { DataTable } from "@/components/global/DataTable";
import FormDialog from "../forms/FormDialog";

import { UserRole } from "@/generated/prisma";
import {
  AnnouncementTableDataType,
  AnnouncementTableRelativeData,
} from "@/types";
import { format } from "date-fns";

type Props = {
  data: AnnouncementTableDataType[];
  userRole: UserRole | null;
  relativeData: AnnouncementTableRelativeData;
};

function AnnouncementsTableWrapper({ data, userRole, relativeData }: Props) {
  const announcementsActions: ColumnDef<AnnouncementTableDataType>[] =
    userRole === "admin"
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
  const columns: ColumnDef<AnnouncementTableDataType>[] = [
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
        return (
          <span>
            {format(new Date(row.original.date), "dd/MM/yyyy HH:mm a")}
          </span>
        );
      },
    },
    ...announcementsActions,
  ];

  return <DataTable columns={columns} data={data} />;
}
export default AnnouncementsTableWrapper;

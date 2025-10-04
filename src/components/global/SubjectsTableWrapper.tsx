"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/global/DataTable";

import FormDialog from "../forms/FormDialog";
import { SubjectTableDataType } from "@/types";
import { UserRole } from "@prisma/client";

type Props = {
  data: SubjectTableDataType[];
  userRole: UserRole | null;
};

function SubjectsTableWrapper({ data, userRole }: Props) {
  const subjectsActions: ColumnDef<SubjectTableDataType>[] =
    userRole === "admin"
      ? [
          {
            header: "Actions",
            id: "actions",
            cell: ({ row }) => {
              return (
                <div className="flex items-center gap-2">
                  <FormDialog
                    table="subject"
                    type="update"
                    data={row.original}
                    id={row.original.id}
                  />{" "}
                  <FormDialog
                    table="subject"
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

  const columns: ColumnDef<SubjectTableDataType>[] = [
    {
      header: "Subject Name",
      accessorKey: "name",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <h3 className="font-semibold">{row.original.name}</h3>
          </div>
        );
      },
    },

    {
      header: "Teachers",
      accessorKey: "teachers",
      cell: ({ row }) => {
        const allTeachers = row.original.teachers.map((c) => c.user.name);
        return <span>{allTeachers.join(", ") || "N/A"}</span>;
      },
    },

    ...subjectsActions,
  ];

  return <DataTable columns={columns} data={data} />;
}
export default SubjectsTableWrapper;

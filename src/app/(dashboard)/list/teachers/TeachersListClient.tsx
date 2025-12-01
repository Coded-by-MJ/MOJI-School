"use client";

import DashboardSearchBar from "@/components/dashboard/DashboardSearchBar";
import Pagination from "@/components/global/Pagination";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ListFilter } from "lucide-react";
import TeachersTableWrapper from "@/components/global/TeachersTableWrapper";
import FormDialog from "@/components/forms/FormDialog";
import AllowedUserCompClient from "@/components/auth/AllowedUserCompClient";
import { teachersQueries } from "@/queries/teachers";
import { TableSearchParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

function TeachersListClient({
  filterParams,
}: {
  filterParams: TableSearchParams;
}) {
  const { data } = useQuery(teachersQueries.list(filterParams));

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <section className="bg-muted gap-4 rounded-md  flex-col flex flex-1">
      <div className="flex p-4 w-full justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex w-max flex-1 md:justify-end  flex-col md:flex-row items-center gap-4">
          <div className="md:max-w-[15rem] w-full">
            <DashboardSearchBar
              searchKey="search"
              placeHolder="Search for teacher"
            />
          </div>
          <div className="flex gap-4  items-center self-end">
            <Button size={"icon"} className="rounded-full  bg-primary">
              <ListFilter className="size-4" />
            </Button>{" "}
            <Button size={"icon"} className="rounded-full  bg-primary">
              <SlidersHorizontal className="size-4" />
            </Button>{" "}
            <AllowedUserCompClient allowedRoles={["admin"]}>
              <FormDialog
                type="create"
                table="teacher"
                relativeData={data.relativeData}
              />
            </AllowedUserCompClient>
          </div>
        </div>
      </div>

      <TeachersTableWrapper data={data.data} />

      <Pagination page={filterParams.page} count={data.count} />
    </section>
  );
}

export default TeachersListClient;


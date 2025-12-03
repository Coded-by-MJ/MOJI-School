"use client";

import DashboardSearchBar from "@/components/dashboard/DashboardSearchBar";
import Pagination from "@/components/global/Pagination";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ListFilter } from "lucide-react";
import AnnouncementsTableWrapper from "@/components/global/AnnouncementsTableWrapper";
import FormDialog from "@/components/forms/FormDialog";
import AllowedUserCompClient from "@/components/auth/AllowedUserCompClient";
import { announcementsQueries } from "@/queries/announcements";
import { TableSearchParams } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ListSkeleton } from "./SkeletonsLoading";

function AnnouncementsListClient({
  filterParams,
}: {
  filterParams: TableSearchParams;
}) {
  const { data, isLoading } = useQuery(announcementsQueries.list(filterParams));

  if (isLoading || !data) {
    return <ListSkeleton />;
  }

  return (
    <section className="bg-muted gap-4 rounded-md flex-col justify-between flex flex-1">
      <div className="flex p-4 w-full justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">
          All Announcements
        </h1>
        <div className="flex w-max flex-1 md:justify-end flex-col md:flex-row items-center gap-4">
          <div className="md:max-w-[15rem] w-full">
            <DashboardSearchBar
              searchKey="search"
              placeHolder="Search for announcement"
            />
          </div>
          <div className="flex gap-4 items-center self-end">
            <Button size={"icon"} className="rounded-full bg-primary">
              <ListFilter className="size-4" />
            </Button>
            <Button size={"icon"} className="rounded-full bg-primary">
              <SlidersHorizontal className="size-4" />
            </Button>
            <AllowedUserCompClient allowedRoles={["admin"]}>
              <FormDialog
                type="create"
                table="announcement"
                relativeData={data.relativeData}
              />
            </AllowedUserCompClient>
          </div>
        </div>
      </div>

      <AnnouncementsTableWrapper
        data={data.data}
        relativeData={data.relativeData}
        userRole={data.userRole}
      />

      <Pagination count={data.count} page={filterParams.page} />
    </section>
  );
}

export default AnnouncementsListClient;

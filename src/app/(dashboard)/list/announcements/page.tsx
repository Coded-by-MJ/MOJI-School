import DashboardSearchBar from "@/components/dashboard/DashboardSearchBar";
import Pagination from "@/components/global/Pagination";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ListFilter, Plus } from "lucide-react";
import StudentsTableWrapper from "@/components/global/StudentsTableWrapper";
import ParentsTableWrapper from "@/components/global/ParentsTableWrapper";
import AnnouncementsTableWrapper from "@/components/global/AnnouncementsTableWrapper";
import { role } from "@/lib/data";
import FormDialog from "@/components/forms/FormDialog";

import AllowedUserCompClient from "@/components/auth/AllowedUserCompClient";
import { TableSearchParams } from "@/types";
import { fetchAnnouncementList } from "@/lib/query-actions";
import {
  AnnouncementTableDataType,
  AnnouncementTableRelativeData,
} from "@/types";

async function AnnouncementsListPage({
  searchParams,
}: PageProps<"/list/announcements">) {
  const queryParams = await searchParams;
  const filterParams: TableSearchParams = {
    classId: queryParams.classId?.toString(),
    page: queryParams.page ? parseInt(queryParams.page.toString()) : 1,
    search: queryParams.search?.toString(),
  };
  const { data, count, userRole, relativeData } = await fetchAnnouncementList<
    AnnouncementTableDataType[],
    AnnouncementTableRelativeData
  >(filterParams);

  return (
    <section className="bg-muted gap-4 rounded-md  flex-col flex flex-1">
      <div className="flex p-4 w-full justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">
          All Announcements
        </h1>
        <div className="flex w-max flex-1 md:justify-end  flex-col md:flex-row items-center gap-4">
          <div className="md:max-w-[15rem] w-full">
            <DashboardSearchBar
              searchKey="search"
              placeHolder="Search for announcement"
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
                table="announcement"
                relativeData={relativeData}
              />
            </AllowedUserCompClient>
          </div>
        </div>
      </div>

      <AnnouncementsTableWrapper
        data={data}
        relativeData={relativeData}
        userRole={userRole}
      />

      <Pagination count={count} page={filterParams.page} />
    </section>
  );
}
export default AnnouncementsListPage;

import DashboardSearchBar from "@/components/dashboard/DashboardSearchBar";
import Pagination from "@/components/global/Pagination";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ListFilter } from "lucide-react";
import EventsTableWrapper from "@/components/global/EventsTableWrapper";
import FormDialog from "@/components/forms/FormDialog";

import AllowedUserCompClient from "@/components/auth/AllowedUserCompClient";
import { TableSearchParams } from "@/types";
import { fetchEventList } from "@/lib/query-actions";
import { EventTableDataType, EventTableRelativeData } from "@/types";

async function EventsListPage({ searchParams }: PageProps<"/list/events">) {
  const queryParams = await searchParams;
  const filterParams: TableSearchParams = {
    classId: queryParams.classId?.toString(),
    page: queryParams.page ? parseInt(queryParams.page.toString()) : 1,
    search: queryParams.search?.toString(),
  };
  const { data, count, userRole, relativeData } = await fetchEventList<
    EventTableDataType[],
    EventTableRelativeData
  >(filterParams);
  return (
    <section className="bg-muted gap-4 rounded-md  flex-col flex flex-1">
      <div className="flex p-4 w-full justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex w-max flex-1 md:justify-end  flex-col md:flex-row items-center gap-4">
          <div className="md:max-w-[15rem] w-full">
            <DashboardSearchBar
              searchKey="search"
              placeHolder="Search for event"
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
              {<FormDialog type="create" table="event" relativeData={relativeData} />}
            </AllowedUserCompClient>
          </div>
        </div>
      </div>

      <EventsTableWrapper
        data={data}
        userRole={userRole}
        relativeData={relativeData}
      />

      <Pagination count={count} page={filterParams.page} />
    </section>
  );
}
export default EventsListPage;

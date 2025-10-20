import DashboardSearchBar from "@/components/dashboard/DashboardSearchBar";
import Pagination from "@/components/global/Pagination";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ListFilter } from "lucide-react";
import ParentsTableWrapper from "@/components/global/ParentsTableWrapper";
import FormDialog from "@/components/forms/FormDialog";
import AllowedUserCompClient from "@/components/auth/AllowedUserCompClient";
import { fetchParentList } from "@/lib/query-actions";
import { ParentTableDataType, TableSearchParams } from "@/types";

async function ParentsListPage({ searchParams }: PageProps<"/list/parents">) {
  const queryParams = await searchParams;
  const filterParams: TableSearchParams = {
    page: queryParams.page ? parseInt(queryParams.page.toString()) : 1,
    search: queryParams.search?.toString(),
  };
  const { userRole, data, count } = await fetchParentList<ParentTableDataType[]>(
    filterParams
  );
  return (
    <section className="bg-muted gap-4 rounded-md  flex-col flex flex-1">
      <div className="flex p-4 w-full justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
        <div className="flex w-max flex-1 md:justify-end  flex-col md:flex-row items-center gap-4">
          <div className="md:max-w-[15rem] w-full">
            <DashboardSearchBar
              searchKey="search"
              placeHolder="Search for parent"
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
              <FormDialog type="create" table="parent" />
            </AllowedUserCompClient>
          </div>
        </div>
      </div>

      <ParentsTableWrapper data={data} userRole={userRole} />

      <Pagination count={count} page={filterParams.page} />
    </section>
  );
}
export default ParentsListPage;

import AllowedUserCompClient from "@/components/auth/AllowedUserCompClient";
import DashboardSearchBar from "@/components/dashboard/DashboardSearchBar";
import FormDialog from "@/components/forms/FormDialog";
import ClassesTableWrapper from "@/components/global/ClassesTableWrapper";
import Pagination from "@/components/global/Pagination";
import { Button } from "@/components/ui/button";
import { fetchClassList } from "@/lib/query-actions";
import {
  ClassTableDataType,
  ClassTableRelativeData,
  TableSearchParams,
} from "@/types";
import { SlidersHorizontal, ListFilter, Plus } from "lucide-react";

async function ClassesListPage({ searchParams }: PageProps<"/list/classes">) {
  const queryParams = await searchParams;
  const filterParams: TableSearchParams = {
    teacherId: queryParams.teacherId?.toString(),
    page: queryParams.page ? parseInt(queryParams.page.toString()) : 1,
    search: queryParams.search?.toString(),
  };
  const { data, count, userRole, relativeData } = await fetchClassList<
    ClassTableDataType[],
    ClassTableRelativeData
  >(filterParams);

  return (
    <section className="bg-muted gap-4 rounded-md  flex-col flex flex-1">
      <div className="flex p-4 w-full justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
        <div className="flex w-max flex-1 md:justify-end  flex-col md:flex-row items-center gap-4">
          <div className="md:max-w-[15rem] w-full">
            <DashboardSearchBar
              searchKey="search"
              placeHolder="Search for class"
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
                table="class"
                relativeData={relativeData}
              />
            </AllowedUserCompClient>
          </div>
        </div>
      </div>

      <ClassesTableWrapper
        data={data}
        userRole={userRole}
        relativeData={relativeData}
      />

      <Pagination page={filterParams.page} count={count} />
    </section>
  );
}
export default ClassesListPage;

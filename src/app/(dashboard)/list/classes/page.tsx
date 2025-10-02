import DashboardSearchBar from "@/components/dashboard/DashboardSearchBar";
import FormDialog from "@/components/forms/FormDialog";
import ClassesTableWrapper from "@/components/global/ClassesTableWrapper";
import Pagination from "@/components/global/Pagination";
import { Button } from "@/components/ui/button";
import { role } from "@/lib/data";
import { SlidersHorizontal, ListFilter, Plus } from "lucide-react";

function ClassesListPage() {
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
            {role === "admin" && <FormDialog type="create" table="class" />}
          </div>
        </div>
      </div>

      <ClassesTableWrapper />

      <Pagination />
    </section>
  );
}
export default ClassesListPage;

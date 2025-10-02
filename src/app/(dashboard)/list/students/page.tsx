import DashboardSearchBar from "@/components/dashboard/DashboardSearchBar";
import Pagination from "@/components/global/Pagination";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ListFilter, Plus } from "lucide-react";
import StudentsTableWrapper from "@/components/global/StudentsTableWrapper";
import FormDialog from "@/components/forms/FormDialog";
import { role } from "@/lib/data";

function StudentsListPage() {
  return (
    <section className="bg-muted gap-4 rounded-md flex-col flex flex-1">
     <div className="flex p-4 w-full justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
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
            {role === "admin" && <FormDialog type="create" table="student" />}
          </div>
        </div>
      </div>

      <StudentsTableWrapper />

      <Pagination />
    </section>
  );
}
export default StudentsListPage;

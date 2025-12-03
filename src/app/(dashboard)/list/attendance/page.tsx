import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { attendancesQueries } from "@/queries/attendances";
import { TableSearchParams } from "@/types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import AttendanceListClient from "@/components/global/AttendanceListClient";

async function AttendanceListPage({
  searchParams,
}: PageProps<"/list/attendance">) {
  const queryParams = await searchParams;
  const filterParams: TableSearchParams = {
    classId: queryParams.classId?.toString(),
    teacherId: queryParams.teacherId?.toString(),
    page: queryParams.page ? parseInt(queryParams.page.toString()) : 1,
    search: queryParams.search?.toString(),
  };

  const queryClient = getQueryClient();
  const cookies = await getCookiesString();

  await queryClient.prefetchQuery(
    attendancesQueries.withCookies(cookies).list(filterParams)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AttendanceListClient filterParams={filterParams} />
    </HydrationBoundary>
  );
}
export default AttendanceListPage;

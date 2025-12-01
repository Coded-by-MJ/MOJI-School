import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { assignmentsQueries } from "@/queries/assignments";
import { TableSearchParams } from "@/types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import AssignmentsListClient from "@/components/global/AssignmentsListClient";

async function AssignmentsListPage({
  searchParams,
}: PageProps<"/list/assignments">) {
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
    assignmentsQueries.withCookies(cookies).list(filterParams)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AssignmentsListClient filterParams={filterParams} />
    </HydrationBoundary>
  );
}
export default AssignmentsListPage;

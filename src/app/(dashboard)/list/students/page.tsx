import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { studentsQueries } from "@/queries/students";
import { TableSearchParams } from "@/types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import StudentsListClient from "@/components/global/StudentsListClient";

async function StudentsListPage({ searchParams }: PageProps<"/list/students">) {
  const queryParams = await searchParams;
  const filterParams: TableSearchParams = {
    teacherId: queryParams.teacherId?.toString(),
    page: queryParams.page ? parseInt(queryParams.page.toString()) : 1,
    search: queryParams.search?.toString(),
  };

  const queryClient = getQueryClient();
  const cookies = await getCookiesString();

  await queryClient.prefetchQuery(
    studentsQueries.withCookies(cookies).list(filterParams)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudentsListClient filterParams={filterParams} />
    </HydrationBoundary>
  );
}
export default StudentsListPage;

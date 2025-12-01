import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { lessonsQueries } from "@/queries/lessons";
import { TableSearchParams } from "@/types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import LessonsListClient from "./LessonsListClient";

async function LessonsListPage({ searchParams }: PageProps<"/list/lessons">) {
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
    lessonsQueries.withCookies(cookies).list(filterParams)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LessonsListClient filterParams={filterParams} />
    </HydrationBoundary>
  );
}
export default LessonsListPage;

import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { classesQueries } from "@/queries/classes";
import { TableSearchParams } from "@/types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import ClassesListClient from "@/components/global/ClassesListClient";

async function ClassesListPage({ searchParams }: PageProps<"/list/classes">) {
  const queryParams = await searchParams;
  const filterParams: TableSearchParams = {
    teacherId: queryParams.teacherId?.toString(),
    page: queryParams.page ? parseInt(queryParams.page.toString()) : 1,
    search: queryParams.search?.toString(),
  };

  const queryClient = getQueryClient();
  const cookies = await getCookiesString();

  await queryClient.prefetchQuery(
    classesQueries.withCookies(cookies).list(filterParams)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClassesListClient filterParams={filterParams} />
    </HydrationBoundary>
  );
}
export default ClassesListPage;

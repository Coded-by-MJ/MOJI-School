import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { teachersQueries } from "@/queries/teachers";
import { TableSearchParams } from "@/types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import TeachersListClient from "./TeachersListClient";

async function TeachersListPage({ searchParams }: PageProps<"/list/teachers">) {
  const queryParams = await searchParams;
  const filterParams: TableSearchParams = {
    classId: queryParams.classId?.toString(),
    page: queryParams.page ? parseInt(queryParams.page.toString()) : 1,
    search: queryParams.search?.toString(),
  };

  const queryClient = getQueryClient();
  const cookies = await getCookiesString();

  await queryClient.prefetchQuery(
    teachersQueries.withCookies(cookies).list(filterParams)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TeachersListClient filterParams={filterParams} />
    </HydrationBoundary>
  );
}
export default TeachersListPage;

import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { parentsQueries } from "@/queries/parents";
import { TableSearchParams } from "@/types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import ParentsListClient from "@/components/global/ParentsListClient";

async function ParentsListPage({ searchParams }: PageProps<"/list/parents">) {
  const queryParams = await searchParams;
  const filterParams: TableSearchParams = {
    page: queryParams.page ? parseInt(queryParams.page.toString()) : 1,
    search: queryParams.search?.toString(),
  };

  const queryClient = getQueryClient();
  const cookies = await getCookiesString();

  await queryClient.prefetchQuery(
    parentsQueries.withCookies(cookies).list(filterParams)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ParentsListClient filterParams={filterParams} />
    </HydrationBoundary>
  );
}
export default ParentsListPage;

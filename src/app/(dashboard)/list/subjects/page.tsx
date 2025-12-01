import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { subjectsQueries } from "@/queries/subjects";
import { TableSearchParams } from "@/types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import SubjectsListClient from "./SubjectsListClient";

async function SubjectsListPage({ searchParams }: PageProps<"/list/subjects">) {
  const queryParams = await searchParams;
  const filterParams: TableSearchParams = {
    page: queryParams.page ? parseInt(queryParams.page.toString()) : 1,
    search: queryParams.search?.toString(),
  };

  const queryClient = getQueryClient();
  const cookies = await getCookiesString();

  await queryClient.prefetchQuery(
    subjectsQueries.withCookies(cookies).list(filterParams)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SubjectsListClient filterParams={filterParams} />
    </HydrationBoundary>
  );
}
export default SubjectsListPage;

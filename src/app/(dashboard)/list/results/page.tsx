import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { resultsQueries } from "@/queries/results";
import { TableSearchParams } from "@/types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import ResultsListClient from "@/components/global/ResultsListClient";

async function ResultsListPage({ searchParams }: PageProps<"/list/results">) {
  const queryParams = await searchParams;
  const filterParams: TableSearchParams = {
    studentId: queryParams.studentId?.toString(),
    page: queryParams.page ? parseInt(queryParams.page.toString()) : 1,
    search: queryParams.search?.toString(),
  };

  const queryClient = getQueryClient();
  const cookies = await getCookiesString();

  await queryClient.prefetchQuery(
    resultsQueries.withCookies(cookies).list(filterParams)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ResultsListClient filterParams={filterParams} />
    </HydrationBoundary>
  );
}
export default ResultsListPage;

import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { examsQueries } from "@/queries/exams";
import { TableSearchParams } from "@/types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import ExamsListClient from "@/components/global/ExamsListClient";

async function ExamsListPage({ searchParams }: PageProps<"/list/exams">) {
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
    examsQueries.withCookies(cookies).list(filterParams)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExamsListClient filterParams={filterParams} />
    </HydrationBoundary>
  );
}
export default ExamsListPage;

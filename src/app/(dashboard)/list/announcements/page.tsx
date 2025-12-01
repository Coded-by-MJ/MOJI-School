import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { announcementsQueries } from "@/queries/announcements";
import { TableSearchParams } from "@/types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import AnnouncementsListClient from "@/components/global/AnnouncementsListClient";

async function AnnouncementsListPage({
  searchParams,
}: PageProps<"/list/announcements">) {
  const queryParams = await searchParams;
  const filterParams: TableSearchParams = {
    page: queryParams.page ? parseInt(queryParams.page.toString()) : 1,
    search: queryParams.search?.toString(),
  };

  const queryClient = getQueryClient();
  const cookies = await getCookiesString();

  await queryClient.prefetchQuery(
    announcementsQueries.withCookies(cookies).list(filterParams)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AnnouncementsListClient filterParams={filterParams} />
    </HydrationBoundary>
  );
}
export default AnnouncementsListPage;

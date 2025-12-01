import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { eventsQueries } from "@/queries/events";
import { TableSearchParams } from "@/types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import EventsListClient from "@/components/global/EventsListClient";

async function EventsListPage({ searchParams }: PageProps<"/list/events">) {
  const queryParams = await searchParams;
  const filterParams: TableSearchParams = {
    page: queryParams.page ? parseInt(queryParams.page.toString()) : 1,
    search: queryParams.search?.toString(),
  };

  const queryClient = getQueryClient();
  const cookies = await getCookiesString();

  await queryClient.prefetchQuery(
    eventsQueries.withCookies(cookies).list(filterParams)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventsListClient filterParams={filterParams} />
    </HydrationBoundary>
  );
}
export default EventsListPage;

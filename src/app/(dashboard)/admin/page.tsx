import { isUserAllowed } from "@/lib/users";
import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { dashboardQueries } from "@/queries/dashboard";
import { eventsQueries } from "@/queries/events";
import { announcementsQueries } from "@/queries/announcements";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import AdminPageClient from "@/components/dashboard/AdminPageClient";

async function AdminPage({ searchParams }: PageProps<"/admin">) {
  await isUserAllowed(["admin"]);
  const queryParams = await searchParams;
  const eventsDate = queryParams.date ? queryParams.date.toString() : undefined;

  const queryClient = getQueryClient();
  const cookies = await getCookiesString();

  await Promise.all([
    queryClient.prefetchQuery(
      dashboardQueries.withCookies(cookies).getUserRolesChart()
    ),
    queryClient.prefetchQuery(
      dashboardQueries.withCookies(cookies).getStudentsChart()
    ),
    queryClient.prefetchQuery(
      dashboardQueries.withCookies(cookies).getAttendanceChart()
    ),
    queryClient.prefetchQuery(
      eventsQueries.withCookies(cookies).getByDate(eventsDate)
    ),
    queryClient.prefetchQuery(
      announcementsQueries.withCookies(cookies).getRecent()
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminPageClient eventsDate={eventsDate} />
    </HydrationBoundary>
  );
}
export default AdminPage;

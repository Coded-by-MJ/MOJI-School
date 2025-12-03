import ClassSchedule from "@/components/global/ClassSchedule";
import { isUserAllowed } from "@/lib/users";
import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { parentsQueries } from "@/queries/parents";
import { announcementsQueries } from "@/queries/announcements";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import ParentPageClient from "@/components/dashboard/ParentPageClient";

async function ParentPage() {
  const { id } = await isUserAllowed(["parent"]);
  const queryClient = getQueryClient();
  const cookies = await getCookiesString();

  await Promise.all([
    queryClient.prefetchQuery(
      parentsQueries.withCookies(cookies).getStudents(id)
    ),
    queryClient.prefetchQuery(
      announcementsQueries.withCookies(cookies).getRecent()
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ParentPageClient parentId={id} />
    </HydrationBoundary>
  );
}
export default ParentPage;

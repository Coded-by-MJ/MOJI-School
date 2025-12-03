import ClassSchedule from "@/components/global/ClassSchedule";
import { isUserAllowed } from "@/lib/users";
import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { studentsQueries } from "@/queries/students";
import { eventsQueries } from "@/queries/events";
import { announcementsQueries } from "@/queries/announcements";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import StudentPageClient from "@/components/dashboard/StudentPageClient";

async function StudentPage({ searchParams }: PageProps<"/student">) {
  const queryParams = await searchParams;
  const eventsDate = queryParams.date ? queryParams.date.toString() : undefined;
  const { id } = await isUserAllowed(["student"]);
  const queryClient = getQueryClient();
  const cookies = await getCookiesString();

  await Promise.all([
    queryClient.prefetchQuery(
      studentsQueries.withCookies(cookies).getClass(id)
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
      <StudentPageClient studentId={id} eventsDate={eventsDate} />
    </HydrationBoundary>
  );
}
export default StudentPage;

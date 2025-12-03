import ClassSchedule from "@/components/global/ClassSchedule";
import { isUserAllowed } from "@/lib/users";
import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { announcementsQueries } from "@/queries/announcements";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import TeacherPageClient from "@/components/dashboard/TeacherPageClient";

async function TeachersPage() {
  const { id } = await isUserAllowed(["teacher"]);
  const queryClient = getQueryClient();
  const cookies = await getCookiesString();

  await queryClient.prefetchQuery(
    announcementsQueries.withCookies(cookies).getRecent()
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TeacherPageClient teacherId={id} />
    </HydrationBoundary>
  );
}
export default TeachersPage;

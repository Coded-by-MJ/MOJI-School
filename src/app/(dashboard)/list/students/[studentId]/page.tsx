import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { studentsQueries } from "@/queries/students";
import { announcementsQueries } from "@/queries/announcements";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import SingleStudentPageClient from "@/components/global/SingleStudentPageClient";

async function SingleStudentPage({
  params,
}: PageProps<"/list/students/[studentId]">) {
  const { studentId } = await params;

  const queryClient = getQueryClient();
  const cookies = await getCookiesString();

  // Only prefetch queries, no fetchQuery or redirect logic
  await Promise.all([
    queryClient.prefetchQuery(
      studentsQueries.withCookies(cookies).getById(studentId)
    ),
    queryClient.prefetchQuery(
      announcementsQueries.withCookies(cookies).getRecent()
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SingleStudentPageClient studentId={studentId} />
    </HydrationBoundary>
  );
}
export default SingleStudentPage;

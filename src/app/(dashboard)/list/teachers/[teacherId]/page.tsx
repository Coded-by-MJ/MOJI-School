import { getQueryClient, getCookiesString } from "@/lib/query-client-helpers";
import { teachersQueries } from "@/queries/teachers";
import { announcementsQueries } from "@/queries/announcements";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import SingleTeacherPageClient from "@/components/global/SingleTeacherPageClient";

async function SingleTeacherPage({
  params,
}: PageProps<"/list/teachers/[teacherId]">) {
  const { teacherId } = await params;

  const queryClient = getQueryClient();
  const cookies = await getCookiesString();

  // Only prefetch queries, no fetchQuery or redirect logic
  await Promise.all([
    queryClient.prefetchQuery(
      teachersQueries.withCookies(cookies).getById(teacherId)
    ),
    queryClient.prefetchQuery(
      announcementsQueries.withCookies(cookies).getRecent()
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SingleTeacherPageClient teacherId={teacherId} />
    </HydrationBoundary>
  );
}
export default SingleTeacherPage;

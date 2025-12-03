import { Prisma } from "@/generated/prisma";
import { toast } from "sonner";

export const getDefaultImage = (name: string) => {
  const firstName = name.split(" ")[0];
  const lastName = name.split(" ")[1];

  return `https://ui-avatars.com/api/?size=60&background=d1d6dc&color=000&rounded=true&name=${firstName}+${lastName}`;
};

export const extractId = (id: string) => {
  const newId = id.slice(0, 6);
  return newId;
};

export const getDefaultPassword = (name: string) => {
  const password = `pass@moji-school-${name.replaceAll(" ", "-").toLowerCase()}`;
  return password;
};

export const renderClientError = (error: unknown) => {
  console.log(error);
  let message: string = "An error occurred";
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    message = "Database Error";
  }
  if (error instanceof Error) {
    message = error.message;
  }
  toast.error(message);
};

export function extractOrJoinName<T extends string | [string, string]>(
  name: T
): T extends string ? [string, string] : string {
  if (Array.isArray(name)) {
    // Input was a tuple → return a string
    return name.join(" ") as any;
  } else {
    // Input was a string → return a tuple
    const [firstName, lastName = ""] = name.split(" ");
    return [firstName, lastName] as any;
  }
}

const getLatestMonday = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const latestMonday = today;
  latestMonday.setDate(today.getDate() - daysSinceMonday);
  return latestMonday;
};
export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
  const latestMonday = getLatestMonday();

  return lessons.map((lesson) => {
    const lessonDayOfWeek = lesson.start.getDay();

    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

    const adjustedStartDate = new Date(latestMonday);

    adjustedStartDate.setDate(latestMonday.getDate() + daysFromMonday);
    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(),
      lesson.start.getSeconds()
    );
    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds()
    );

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};
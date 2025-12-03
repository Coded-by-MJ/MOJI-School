import prisma from "@/lib/prisma";

// Use DIRECT_URL for seeding (same as migrations)
// If DIRECT_URL is not set, fallback to DATABASE_URL

async function main() {


  // === GRADES ===
  const grades = await Promise.all(
    Array.from({ length: 6 }).map((_, i) =>
      prisma.grade.create({
        data: { level: i + 1 },
      })
    )
  );

  // === SUBJECTS ===
  const subjectData = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Art",
  ].map((name) => ({ name }));

  const subjects = await prisma.$transaction(
    subjectData.map((s) => prisma.subject.create({ data: s }))
  );

  // === ANNOUNCEMENTS ===

  console.log("✅ Seeding completed successfully.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });

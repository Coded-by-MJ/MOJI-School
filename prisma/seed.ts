import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // === ADMIN, TEACHER, STUDENT SEEDING ===
  // Leave this part as you already have in your project.
  // Example:
  // await prisma.user.create({ data: { id: "admin1", role: "ADMIN", ... } });

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

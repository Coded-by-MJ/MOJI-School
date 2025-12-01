import prisma from "@/lib/prisma";

// Use DIRECT_URL for seeding (same as migrations)
// If DIRECT_URL is not set, fallback to DATABASE_URL

async function main() {
  // === ADMIN USER SEEDING ===
  const adminEmail = "info@miracleibharokhonre.com";
  const adminName = "Admin User";
  const adminPassword = "admin123";

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // Hash the password using bcrypt (better-auth uses bcrypt with 10 rounds)

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        role: "admin",
        emailVerified: true,
        isPasswordResetRequired: true,
      },
    });

    // Create account with hashed password
    await prisma.account.create({
      data: {
        userId: adminUser.id,
        accountId: adminUser.id,
        providerId: "credential",
        password: adminPassword,
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
  } else {
    console.log("ℹ️  Admin user already exists, skipping creation.");
  }

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

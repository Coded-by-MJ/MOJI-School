import { getAuthUser } from "@/lib/users";
import ProfileClient from "@/components/profile/ProfileClient";
import { UserRole } from "@/generated/prisma";

async function ProfilePage() {
  const user = await getAuthUser();

  return (
    <ProfileClient
      name={user.name}
      image={user.image ?? null}
      role={user.role as UserRole}
      email={user.email}
    />
  );
}
export default ProfilePage;

import { getAuthUser } from "@/lib/users";
import ProfileClient from "@/components/profile/ProfileClient";

async function ProfilePage() {
  const { name, image, role, email } = await getAuthUser();

  return <ProfileClient name={name} image={image} role={role} email={email} />;
}
export default ProfilePage;

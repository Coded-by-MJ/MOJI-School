import FormInput from "@/components/forms/FormInput";
import { Card } from "@/components/ui/card";
import { getAuthUser, updateUserProfile } from "@/lib/users";
import { cn } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import { getDefaultImage } from "@/utils/funcs";
import { ProfileFormSubmitButton } from "@/components/forms/FormSubmitButton";
import FormContainer from "@/components/forms/FormContainer";

async function ProfilePage() {
  const { name, image, role, email } = await getAuthUser();
  const firstName = name.split(" ")[0];
  const lastName = name.split(" ")[1];
  const imageUrl = image || getDefaultImage(name);

  return (
    <div className="flex items-center justify-center w-full py-4">
      <Card className="p-4 w-full max-w-[600px]">
        <FormContainer
          action={updateUserProfile}
          className="w-full flex-col flex gap-4"
        >
          <Image
            src={imageUrl}
            alt={name}
            width={150}
            height={150}
            priority
            placeholder="empty"
            className="rounded-full object-cover object-center size-[150px]"
          />

          <div
            className={cn(
              "text-xs w-[170px] bg-primary flex gap-1 justify-center items-center p-1.5 rounded-2xl border border-current font-medium"
            )}
          >
            <BadgeCheck className="size-5 text-inherit" />
            <span className="font-bold uppercase text-nowrap">{role}</span>
          </div>

          <div className="flex flex-col w-full gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormInput
                className="w-full flex flex-col gap-2"
                type="text"
                name="firstName"
                label="First Name"
                placeholder="Your First Name"
                defaultValue={firstName}
              />
              <FormInput
                className="w-full flex flex-col gap-2"
                type="text"
                name="lastName"
                label="Last Name"
                placeholder="Your Last Name"
                defaultValue={lastName}
              />
            </div>
            <FormInput
              type="email"
              className="w-full flex flex-col gap-2"
              name="email"
              label="Email Address"
              readOnly={true}
              placeholder="Enter your email address"
              defaultValue={email}
            />

            <ProfileFormSubmitButton />
          </div>
        </FormContainer>
      </Card>
    </div>
  );
}
export default ProfilePage;

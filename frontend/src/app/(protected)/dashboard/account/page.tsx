import { services } from "@/data/services";
import { validateApiResponse } from "@/lib/error-handler";
import { ProfileForm } from "@/components/forms/profile-form";
import { ProfileImageForm } from "@/components/forms/profile-image-form";

export default async function AccountRoute() {
  const user = await services.auth.getUserMeService();
  const userData = validateApiResponse(user, "user profile");
  const userImage = userData?.image;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
      <ProfileForm user={userData} className="col-span-3" />
      <ProfileImageForm image={userImage} className="col-span-2" />
    </div>
  );
}
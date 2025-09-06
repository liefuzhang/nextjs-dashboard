import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const profileData = {
    name: user.fullName || user.firstName || "",
    email: user.primaryEmailAddress?.emailAddress || "",
    company: user.publicMetadata?.company as string || "",
    location: user.publicMetadata?.location as string || "",
    phone: user.publicMetadata?.phone as string || "",
    title: user.publicMetadata?.title as string || "",
    role: user.publicMetadata?.role as string || "user",
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account and business information</p>
      </div>

      <ProfileForm initialData={profileData} userId={user.id} />
    </div>
  );
}
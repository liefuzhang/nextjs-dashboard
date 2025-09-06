"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type ProfileActionResult = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function updateUserProfile(
  prevState: ProfileActionResult,
  formData: FormData
): Promise<ProfileActionResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // Extract form data
    const company = formData.get("company") as string;
    const location = formData.get("location") as string;
    const phone = formData.get("phone") as string;
    const title = formData.get("title") as string;
    const role = formData.get("role") as string;

    // Update user metadata in Clerk
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: {
        company: company || "",
        location: location || "",
        phone: phone || "",
        title: title || "",
        role: role || "user",
      },
    });

    // Revalidate the profile page to show updated data
    revalidatePath("/profile");

    return {
      success: true,
      message: "Profile updated successfully!",
    };

  } catch (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      error: "Failed to update profile. Please try again.",
    };
  }
}
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function handleSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function handleSignIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirectTo") as string || "/dashboard";

  const supabase = await createClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}&redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  redirect(redirectTo);
}

export async function handleSignUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const fullName = formData.get("fullName") as string;
  const redirectTo = formData.get("redirectTo") as string || "/dashboard";

  if (password !== confirmPassword) {
    redirect(`/signup?error=${encodeURIComponent("Passwords do not match")}&redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${origin}/auth/confirm?redirectTo=${encodeURIComponent(redirectTo)}`,
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}&redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  redirect(`/signup?success=${encodeURIComponent("Please check your email to confirm your account!")}&redirectTo=${encodeURIComponent(redirectTo)}`);
}

export async function handleMagicLinkSignIn(formData: FormData) {
  const email = formData.get("email") as string;
  const redirectTo = formData.get("redirectTo") as string || "/dashboard";

  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?redirectTo=${encodeURIComponent(redirectTo)}`,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}&redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  redirect(`/login?success=${encodeURIComponent("Check your email for the login link!")}&redirectTo=${encodeURIComponent(redirectTo)}`);
}
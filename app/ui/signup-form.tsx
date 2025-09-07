"use client";

import { lusitana } from "@/app/ui/fonts";
import {
  AtSymbolIcon,
  KeyIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "./button";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { FormField } from "./auth/form-field";
import { MessageDisplay } from "./auth/message-display";
import { SocialLoginButton } from "./auth/social-login-button";
import { handleSignUp, handleMagicLinkSignIn } from "@/app/lib/auth-actions";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const errorMessage = searchParams.get("error");
  const successMessage = searchParams.get("success");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (error) {
      console.error("Google auth error:", error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
      <h1 className={`${lusitana.className} mb-3 text-2xl`}>
        Create your account
      </h1>

      <Tabs defaultValue="password" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="magic">Magic Link</TabsTrigger>
        </TabsList>

        <TabsContent value="password" className="space-y-3">
          <form action={handleSignUp} className="space-y-3">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div className="w-full space-y-4">
              <FormField
                label="Full Name"
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                required
                icon={UserIcon}
              />
              <FormField
                label="Email"
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
                icon={AtSymbolIcon}
              />
              <FormField
                label="Password"
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                required
                minLength={6}
                icon={KeyIcon}
              />
              <FormField
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                required
                minLength={6}
                icon={KeyIcon}
              />
            </div>
            <Button type="submit" className="mt-4 w-full">
              Sign up <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="magic" className="space-y-3">
          <form action={handleMagicLinkSignIn} className="space-y-3">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div className="w-full">
              <FormField
                label="Email"
                id="email-magic"
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
                icon={AtSymbolIcon}
              />
            </div>
            <Button type="submit" className="mt-4 w-full">
              Send Sign Up Link <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            </Button>
            <p className="text-sm text-gray-600 text-center">
              We&apos;ll send you a secure link to create your account.
            </p>
          </form>
        </TabsContent>
      </Tabs>

      {/* Social Sign Up - Always Visible */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-50 px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <SocialLoginButton onClick={handleGoogleAuth} disabled={isLoading}>
          Continue with Google
        </SocialLoginButton>
      </div>

      <MessageDisplay errorMessage={errorMessage} successMessage={successMessage} />

      {/* Login Link */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link 
            href={`/login${searchParams.get("redirectTo") ? `?redirectTo=${searchParams.get("redirectTo")}` : ""}`}
            className="text-blue-600 hover:text-blue-500 underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
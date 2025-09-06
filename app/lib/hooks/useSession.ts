"use client";

import { useUser } from "@clerk/nextjs";

export function useSession() {
  const { user, isLoaded, isSignedIn } = useUser();
  
  return {
    data: isSignedIn ? {
      user: {
        id: user?.id,
        name: user?.fullName || user?.firstName,
        email: user?.primaryEmailAddress?.emailAddress,
        role: user?.publicMetadata?.role as 'admin' | 'user' || 'user',
      }
    } : null,
    status: !isLoaded ? "loading" : isSignedIn ? "authenticated" : "unauthenticated"
  };
}
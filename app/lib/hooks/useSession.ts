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
        // Business data from Clerk metadata
        company: user?.publicMetadata?.company as string,
        location: user?.publicMetadata?.location as string,
        phone: user?.publicMetadata?.phone as string,
        title: user?.publicMetadata?.title as string,
      }
    } : null,
    status: !isLoaded ? "loading" : isSignedIn ? "authenticated" : "unauthenticated"
  };
}
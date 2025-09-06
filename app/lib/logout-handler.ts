"use client";

import { useClerk } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";

export function useLogoutHandler() {
  const { signOut } = useClerk();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    // Clear cache before logout
    queryClient.clear();
    
    // Sign out with explicit redirect to sign-in page
    await signOut({
      redirectUrl: "/sign-in"
    });
  };

  return { handleLogout };
}
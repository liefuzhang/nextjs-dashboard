"use client";

import { signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

export function useLogoutHandler() {
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    // Sign out first, then clear cache after redirect
    await signOut({ 
      redirect: true,
      callbackUrl: "/" 
    });
    
    // Clear cache after successful logout
    queryClient.clear();
  };

  return { handleLogout };
}
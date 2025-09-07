"use client";

import { useSupabaseAuth } from "@/app/components/supabase-auth-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogoutHandler() {
  const queryClient = useQueryClient();
  const { signOut } = useSupabaseAuth();
  const router = useRouter();

  const handleLogout = async () => {
    // Sign out from Supabase
    await signOut();
    
    // Clear cache after successful logout
    queryClient.clear();
    
    // Redirect to home page
    router.push("/");
  };

  return { handleLogout };
}
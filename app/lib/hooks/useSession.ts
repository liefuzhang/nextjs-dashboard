"use client";

import { useSupabaseAuth } from "@/app/components/supabase-auth-provider";
import { mapSupabaseUserToAppUser } from "@/lib/supabase/types";

export function useSession(): SessionHookReturn {
  const { user, loading } = useSupabaseAuth();
  
  return {
    data: user ? { 
      user: mapSupabaseUserToAppUser(user)
    } : null,
    status: loading ? "loading" : user ? "authenticated" : "unauthenticated"
  };
}
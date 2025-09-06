"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

// Safely refetch the session once per route change to keep
// client session state in sync after server-side signIn/signOut
// without creating a re-render loop.
export function SessionRefresher() {
  const { update } = useSession();
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);
  const inflightRef = useRef(false);

  useEffect(() => {
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;

    if (inflightRef.current) return;
    inflightRef.current = true;

    Promise.resolve(update())
      .catch(() => {})
      .finally(() => {
        inflightRef.current = false;
      });
    // Intentionally exclude `update` from deps to avoid effect retrigger
    // when NextAuth changes the session and the update function identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

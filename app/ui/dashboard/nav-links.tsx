"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  CogIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/app/lib/hooks/useSession";
import { usePrefetchOnHover } from "@/app/lib/prefetch";
import clsx from "clsx";
import { useEffect, useRef } from "react";

// Define a simple session type that matches our useSession return structure
type SessionData = {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: 'admin' | 'user';
  }
};

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  {
    name: "Home",
    href: "/dashboard",
    icon: HomeIcon,
    roles: ["user", "admin"],
  },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: DocumentDuplicateIcon,
    roles: ["user", "admin"],
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
    icon: UserGroupIcon,
    roles: ["user", "admin"],
  },
  {
    name: "Profile", 
    href: "/profile", 
    icon: UserIcon, 
    roles: ["user", "admin"]
  },
  { name: "Admin", href: "/admin", icon: CogIcon, roles: ["admin"] },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { prefetchForRoute } = usePrefetchOnHover();

  // Keep last known session to avoid UI flicker during background refreshes
  const lastSessionRef = useRef<SessionData | null>(null);
  useEffect(() => {
    if (status !== "loading") {
      lastSessionRef.current = session;
    }
  }, [session, status]);

  const effectiveSession = status === "loading" ? lastSessionRef.current : session;
  const userRole = effectiveSession?.user?.role;

  // Only show sign-in message when we know the user is unauthenticated
  if (status === "unauthenticated") {
    return <div>Please sign in</div>;
  }

  const filteredLinks = links.filter((link) => {
    // Show links for users that have any of the required roles
    return userRole ? link.roles.includes(userRole) : false;
  });

  return (
    <>
      {filteredLinks.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            onMouseEnter={() => prefetchForRoute(link.href)}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/app/lib/hooks/useSession";
import { usePrefetchOnHover } from "@/app/lib/prefetch";
import clsx from "clsx";

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
  { name: "Admin", href: "/admin", icon: CogIcon, roles: ["admin"] },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;
  const { prefetchForRoute } = usePrefetchOnHover();

  console.log("🔍 NavLinks Debug:", {
    status,
    session: session ? "exists" : "null",
    userRole,
    sessionUser: session?.user,
    fullSession: session,
  });

  // Show loading state while session is loading
  if (status === "loading") {
    return <div>Loading nav...</div>;
  }

  // Show fallback if no session (unauthenticated)
  if (status === "unauthenticated" || !session) {
    console.log("🔍 No session - user not authenticated");
    return <div>Please log in</div>;
  }

  const filteredLinks = links.filter((link) => {
    // Show links for users that have any of the required roles
    const shouldShow = userRole && link.roles.includes(userRole);
    console.log(
      `🔍 Link "${
        link.name
      }": userRole="${userRole}", link.roles=${JSON.stringify(
        link.roles
      )}, shouldShow=${shouldShow}`
    );
    return shouldShow;
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

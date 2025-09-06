"use client";

import SideNav from "@/app/ui/dashboard/sidenav";
import { usePrefetchAnticipatedRoutes } from "@/app/lib/prefetch";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Prefetch data based on current route and anticipated user behavior
  usePrefetchAnticipatedRoutes(pathname);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 min-h-0">{children}</div>
    </div>
  );
}

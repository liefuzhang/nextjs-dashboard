"use client";

import { useSession } from "@/app/lib/hooks/useSession";

export function DebugSession() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading session...</div>;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs max-w-xs">
      <h3 className="font-bold mb-2">Debug Session</h3>
      <div>Status: {status}</div>
      <div>User: {session?.user?.name || "None"}</div>
      <div>Email: {session?.user?.email || "None"}</div>
      <div>Role: {session?.user?.role || "None"}</div>
    </div>
  );
}
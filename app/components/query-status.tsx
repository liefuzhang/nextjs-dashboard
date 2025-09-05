"use client";

import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/app/lib/queries";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function QueryStatus() {
  const queryClient = useQueryClient();
  const [lastUpdate, setLastUpdate] = useState<Record<string, string>>({});

  // Track query updates
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.type === "updated") {
        const key = JSON.stringify(event.query.queryKey);
        setLastUpdate((prev) => ({
          ...prev,
          [key]: new Date().toLocaleTimeString(),
        }));
      }
    });

    return unsubscribe;
  }, [queryClient]);

  const queries = [
    { key: queryKeys.revenue, name: "Revenue", interval: "2m" },
    { key: queryKeys.latestInvoices, name: "Latest Invoices", interval: "30s" },
    { key: queryKeys.cardData, name: "Dashboard Cards", interval: "5m" },
  ];

  const handleManualRefresh = (queryKey: readonly unknown[]) => {
    queryClient.invalidateQueries({ queryKey });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Query Status & Refetch Info
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {queries.map(({ key, name, interval }) => {
            const query = queryClient.getQueryState(key);
            const keyString = JSON.stringify(key);

            return (
              <div key={keyString} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{name}</span>
                  <Badge
                    variant={
                      query?.status === "success" ? "default" : "destructive"
                    }
                  >
                    {query?.status || "idle"}
                  </Badge>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <div>Auto-refetch: {interval}</div>
                  <div>Last updated: {lastUpdate[keyString] || "Never"}</div>
                  <div>
                    Data age:{" "}
                    {query?.dataUpdatedAt
                      ? `${Math.round(
                          (Date.now() - query.dataUpdatedAt) / 1000
                        )}s ago`
                      : "No data"}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleManualRefresh(key)}
                  className="w-full text-xs"
                >
                  Manual Refresh
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>🔄 Revenue refetches every 2 minutes, even in background</p>
          <p>⚡ Latest invoices refetch every 30 seconds when tab is active</p>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import React from "react";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface QueryErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function QueryErrorFallback({ error, resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-red-900">Something went wrong</CardTitle>
        <CardDescription className="text-red-700">
          We encountered an error while loading the data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800 font-mono">
            {error.message}
          </p>
        </div>
        <div className="flex gap-2 justify-center">
          <Button 
            onClick={resetErrorBoundary}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface QueryErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<QueryErrorFallbackProps>;
}

export function QueryErrorBoundary({ 
  children, 
  fallback: Fallback = QueryErrorFallback 
}: QueryErrorBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      onReset={reset}
      resetKeys={[]} // Reset when queries are refetched
    >
      {children}
    </ErrorBoundary>
  );
}

// Lightweight error boundary for inline components
export function InlineQueryErrorBoundary({ children }: { children: React.ReactNode }) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center p-4 text-red-600 bg-red-50 rounded-lg border border-red-200">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span className="text-sm">Failed to load data</span>
          <Button 
            variant="link" 
            size="sm"
            onClick={reset}
            className="ml-2 text-red-600 hover:text-red-700"
          >
            Retry
          </Button>
        </div>
      }
      onReset={reset}
    >
      {children}
    </ErrorBoundary>
  );
}
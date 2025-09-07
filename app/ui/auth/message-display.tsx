"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface MessageDisplayProps {
  errorMessage?: string | null;
  successMessage?: string | null;
}

export function MessageDisplay({ errorMessage, successMessage }: MessageDisplayProps) {
  return (
    <>
      {/* Success Message */}
      {successMessage && (
        <div className="flex h-8 items-end space-x-1 mt-4" aria-live="polite" aria-atomic="true">
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      <div
        className="flex h-8 items-end space-x-1 mt-4"
        aria-live="polite"
        aria-atomic="true"
      >
        {errorMessage && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{errorMessage}</p>
          </>
        )}
      </div>
    </>
  );
}
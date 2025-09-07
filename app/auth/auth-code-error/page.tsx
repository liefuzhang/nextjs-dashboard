import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          <span className="text-blue-600">Auth</span> Error
        </h1>

        <p className="mt-3 text-2xl">
          Sorry, we couldn&apos;t sign you in.
        </p>

        <p className="mt-2 text-lg text-gray-600">
          There was an error with the authentication process.
        </p>

        <div className="mt-8">
          <Link
            href="/login"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  )
}
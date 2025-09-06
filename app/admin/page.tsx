import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const { sessionClaims, userId } = await auth();

  // This should be handled by middleware, but adding extra check for security
  if (!userId || sessionClaims?.metadata?.role !== "admin") {
    redirect("/dashboard");
  }

  const user = await currentUser();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome to the admin area, {user?.fullName || user?.firstName}!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            User Management
          </h2>
          <p className="text-gray-600 mb-4">Manage user accounts and roles</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Manage Users
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            System Settings
          </h2>
          <p className="text-gray-600 mb-4">Configure application settings</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Settings
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Analytics
          </h2>
          <p className="text-gray-600 mb-4">
            View system analytics and reports
          </p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            View Analytics
          </button>
        </div>
      </div>

      <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold mb-2">Admin Only Content</h3>
        <p className="text-red-700">
          This content is only visible to users with admin role. Your role:{" "}
          <strong>{sessionClaims?.metadata?.role as string}</strong>
        </p>
      </div>
    </div>
  );
}

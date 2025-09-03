import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  
  if (!session) {
    return Response.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  return Response.json({
    message: "This is a protected API route",
    user: session.user?.email,
    timestamp: new Date().toISOString()
  });
}
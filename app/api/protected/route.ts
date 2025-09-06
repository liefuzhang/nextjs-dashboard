import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { sessionClaims, userId } = await auth();
  
  if (!userId) {
    return Response.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  return Response.json({
    message: "This is a protected API route",
    user: sessionClaims?.email,
    timestamp: new Date().toISOString()
  });
}
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    const { sessionClaims, userId } = await auth();

    // Additional server-side check (middleware should handle this)
    if (!userId || sessionClaims?.metadata?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Fetch all users (admin only functionality)
    const users = await sql`
      SELECT id, name, email, role 
      FROM users 
      ORDER BY name ASC
    `;

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

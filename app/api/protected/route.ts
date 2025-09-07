import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return Response.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  return Response.json({
    message: "This is a protected API route",
    user: user.email,
    timestamp: new Date().toISOString()
  });
}
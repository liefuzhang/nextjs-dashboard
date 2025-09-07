import { updateSession } from './lib/supabase/middleware'

export async function middleware(request: any) {
  return await updateSession(request)
}

export const config = {
  // Protect all routes except:
  // - API routes that don't need authentication
  // - Static files (_next/static, images)
  // - Auth API routes (handled by Supabase)
  // - Public pages (login, signup, etc.)
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

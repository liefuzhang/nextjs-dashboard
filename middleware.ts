import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

export default NextAuth(authConfig).auth;

export const config = {
  // Protect all routes except:
  // - API routes that don't need authentication
  // - Static files (_next/static, images)
  // - Auth API routes (handled by NextAuth)
  // - Public pages (login, signup, etc.)
  matcher: [
    "/((?!api/auth|_next/static|_next/image|.*\\.png$|login|signup|$).*)"
  ],
};

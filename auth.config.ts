import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Define protected routes
      const protectedRoutes = ["/dashboard", "/profile", "/settings"];
      const isProtectedRoute = protectedRoutes.some(route => 
        pathname.startsWith(route)
      );

      // Define public routes that logged-in users should be redirected from
      const publicRoutes = ["/login", "/signup"];
      const isPublicRoute = publicRoutes.includes(pathname);

      // API route protection
      if (pathname.startsWith("/api/")) {
        // Allow auth API routes
        if (pathname.startsWith("/api/auth")) {
          return true;
        }
        // Protect other API routes
        if (!isLoggedIn) {
          return Response.json(
            { error: "Authentication required" },
            { status: 401 }
          );
        }
        return true;
      }

      // Redirect authenticated users away from public pages
      if (isLoggedIn && isPublicRoute) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // Protect routes that require authentication
      if (isProtectedRoute && !isLoggedIn) {
        return false; // Redirect to login page
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

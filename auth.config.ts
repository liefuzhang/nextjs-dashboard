import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role as 'admin' | 'user';
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;
      const { pathname } = nextUrl;

      // Define protected routes
      const protectedRoutes = ["/dashboard", "/profile", "/settings"];
      const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
      );

      // Define admin-only routes
      const adminRoutes = ["/admin"];
      const isAdminRoute = adminRoutes.some((route) =>
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

        // Allow seed route for development (remove in production)
        if (pathname.startsWith("/api/seed")) {
          return true;
        }

        // Admin API routes
        if (pathname.startsWith("/api/admin")) {
          if (!isLoggedIn) {
            return Response.json(
              { error: "Authentication required" },
              { status: 401 }
            );
          }
          if (userRole !== "admin") {
            return Response.json(
              { error: "Admin access required1" },
              { status: 403 }
            );
          }
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

      // Protect admin routes
      if (isAdminRoute) {
        if (!isLoggedIn) {
          return false; // Redirect to login page
        }
        if (userRole !== "admin") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
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

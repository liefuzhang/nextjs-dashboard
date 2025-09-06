import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/profile(.*)',
  '/settings(.*)',
  '/api/((?!auth|seed).*)', // Protect API routes except auth and seed
]);

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Admin route protection
  if (isAdminRoute(req)) {
    await auth.protect();
    
    // Additional check for admin role using session claims
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== 'admin') {
      const signInUrl = new URL('/sign-in', req.url);
      return Response.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

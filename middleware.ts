import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define the routes that should be publicly accessible.
const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/contact",
  "/features",
  "/pricing",
  "/q/(.*)", // Public patient tracking page (e.g., /q/some-id)
  "/api/stripe/webhooks",
]);

// Make the middleware function async
export default clerkMiddleware(async (auth, request) => {
  // If the requested route is not public, check for authentication.
  if (!isPublicRoute(request)) {
    // Await the auth() call to get the user's authentication state.
    const { userId } = await auth();

    // If the user is not signed in, redirect them to the sign-in page.
    if (!userId) {
      const signInUrl = new URL("/login", request.url);
      signInUrl.searchParams.set("redirect_url", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // If the route is public or the user is authenticated, allow the request to proceed.
  return NextResponse.next();
});

export const config = {
  // The matcher ensures that the middleware runs on all routes except for
  // static assets and Next.js-specific paths.
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
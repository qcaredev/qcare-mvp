import { authMiddleware } from "@clerk/nextjs/server";

// This is the simplest and most robust way to configure Clerk middleware for the packages we've installed.
// It protects all routes by default.
// Public routes are exempted via the publicRoutes array.
export default authMiddleware({
  publicRoutes: [
    "/",
    "/about",
    "/contact",
    "/features",
    "/pricing",
    "/q/(.*)", // Public patient tracking page (e.g., /q/some-id)
    "/api/stripe/webhooks",
  ],
});

export const config = {
  // The matcher ensures that the middleware runs on all routes except for
  // static assets and Next.js-specific paths.
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

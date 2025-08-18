import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { services } from "@/data/services";

// Define an array of protected routes
const protectedRoutes: string[] = ["/dashboard", "/dashboard/*"];

// Helper function to check if a path is protected
function isProtectedRoute(path: string): boolean {
  if (!path || protectedRoutes.length === 0) return false;
  return protectedRoutes.some((route) => {
    // For exact matches
    if (!route.includes("*")) {
      return path === route;
    }

    // For wildcard routes (e.g., /dashboard/*)
    const basePath = route.replace("/*", "");
    return path === basePath || path.startsWith(`${basePath}/`);
  });
}

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  // Only validate authentication for protected routes
  if (isProtectedRoute(currentPath)) {
    try {
      // Validate user using getUserMe service - this checks:
      // 1. Token exists and is valid
      // 2. User exists in database
      // 3. User account is active (not blocked/deleted)
      const userResponse = await services.auth.getUserMeService();
      
      // If user validation fails, redirect to signin
      if (!userResponse.success || !userResponse.data) {
        return NextResponse.redirect(new URL("/signin", request.url));
      }

      // User is valid, continue to protected route
      return NextResponse.next();
    } catch (error) {
      // If getUserMe throws an error, redirect to signin
      console.error("Middleware authentication error:", error);
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}
// Configure matcher for better performance
export const config = {
  matcher: [
    // Match /dashboard and any path under /dashboard
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/dashboard",
    "/dashboard/:path*",
  ],
};

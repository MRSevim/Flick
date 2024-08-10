import links from "@/utils/Links";
import { authenticatedRoutes } from "./utils/HelperFuncs";
import { NextResponse } from "next/server";

export function middleware(request) {
  const user = request.cookies.get("user")?.value;

  if (
    user &&
    (request.nextUrl.pathname.startsWith(links.login) ||
      request.nextUrl.pathname.startsWith(links.signup()))
  ) {
    return Response.redirect(new URL("/", request.url));
  }
  const requiresAuth = authenticatedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!user && requiresAuth) {
    return Response.redirect(new URL("/login", request.url));
  }
  if (!request.nextUrl.pathname.startsWith(links.myProfile)) {
    const response = NextResponse.next();
    response.cookies.delete("profileUpdateSuccessMessage");
    response.cookies.delete("profileUpdatedEmail");
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

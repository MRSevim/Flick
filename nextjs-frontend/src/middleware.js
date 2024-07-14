import links from "@/utils/Links";

const authenticatedRoutes = ["/my-profile"];
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
}

import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const user = req.cookies.get("token")?.value;

  if (user && !req.nextUrl.pathname.startsWith("/chat")) {
    return Response.redirect(new URL("/chat", req.url));
  }

  if (!user && req.nextUrl.pathname.startsWith("/chat")) {
    return Response.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

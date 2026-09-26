import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const adminCookie = request.cookies.get("admin_authenticated");

  // If trying to access admin dashboard without admin_authenticated cookie, redirect to login
  if (!adminCookie || adminCookie.value !== "true") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};

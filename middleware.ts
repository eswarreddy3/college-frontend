import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_ROUTES = ["/", "/login", "/onboarding", "/activate", "/forgot-password", "/reset-password"]

const ROLE_HOME: Record<string, string> = {
  student: "/dashboard",
  college_admin: "/admin",
  super_admin: "/super-admin",
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("careerezi_token")?.value

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )

  // Unauthenticated — block protected routes
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated — redirect away from public auth routes
  if (token && (pathname === "/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|.*\\.png|.*\\.svg|.*\\.ico|.*\\.jpg|.*\\.jpeg|.*\\.webp|.*\\.gif|.*\\.woff2?|.*\\.ttf).*)",
  ],
}

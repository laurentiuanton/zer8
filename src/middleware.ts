import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const LOCALES = ["ro", "en"]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow auth callback through without any processing
  if (pathname.startsWith("/auth/")) {
    return NextResponse.next()
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options })
          response.cookies.set({ name, value: "", ...options })
        },
      },
    }
  )

  let user = null
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
  } catch {
    // Auth check failed, continue without user
  }

  const pathWithoutLocale = "/" + pathname.split("/").slice(2).join("/")

  const protectedRoutes = ["/checkout", "/orders", "/account"]
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  )

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    const locale = LOCALES.includes(pathname.split("/")[1]) ? pathname.split("/")[1] : "ro"
    url.pathname = `/${locale}/login`
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  const authRoutes = ["/login", "/register"]
  const isAuthRoute = authRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  )

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    const locale = LOCALES.includes(pathname.split("/")[1]) ? pathname.split("/")[1] : "ro"
    url.pathname = `/${locale}`
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

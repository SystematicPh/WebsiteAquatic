import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabaseEnv";

const protectedRoutes = ["/shop", "/checkout", "/dashboard", "/admin"];

type CookieToSet = {
  name: string;
  value: string;
  options?: any;
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const isProtected = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    });

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (isProtected && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/signin";
      url.searchParams.set("redirectedFrom", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    if (request.nextUrl.pathname === "/auth/signin" && user) {
      return NextResponse.redirect(new URL("/shop", request.url));
    }

    return response;
  } catch {
    if (!isProtected) {
      return response;
    }

    const url = request.nextUrl.clone();
    url.pathname = "/auth/signin";
    url.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};

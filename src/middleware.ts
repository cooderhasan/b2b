import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
        // Since we enforced cookie name in auth.ts, we don't strictly need to specify it here if standard,
        // but if we used a custom name, we would.
        // For now, let's rely on standard behavior with our explicit auth.ts config.
        secureCookie: process.env.NODE_ENV === "production",
    });

    const { pathname } = request.nextUrl;

    // Admin routes - require ADMIN or OPERATOR role
    // Admin routes - require ADMIN or OPERATOR role
    if (pathname.startsWith("/admin")) {
        console.log("MW_DEBUG: Path:", pathname, "Token:", !!token, "Role:", token?.role);

        // Allow access to login page for everyone, but redirect logged-in admins to dashboard
        if (pathname === "/admin/login") {
            if (token && (token.role === "ADMIN" || token.role === "OPERATOR")) {
                return NextResponse.redirect(new URL("/admin", request.url));
            }
            return NextResponse.next();
        }

        if (!token) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
        if (token.role !== "ADMIN" && token.role !== "OPERATOR") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // Protected routes - require authentication
    if (
        pathname.startsWith("/checkout") ||
        pathname.startsWith("/orders") ||
        pathname.startsWith("/cart")
    ) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/checkout/:path*",
        "/orders/:path*",
        "/cart/:path*",
    ],
};

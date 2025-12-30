import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
    });

    const { pathname } = request.nextUrl;

    // Admin routes - require ADMIN or OPERATOR role
    if (pathname.startsWith("/admin")) {
        console.log("MIDDLEWARE_DEBUG: Check Admin", {
            path: pathname,
            hasToken: !!token,
            role: token?.role
        });

        // Allow access to login page for everyone, but redirect logged-in admins to dashboard
        if (pathname === "/admin/login") {
            if (token && (token.role === "ADMIN" || token.role === "OPERATOR")) {
                return NextResponse.redirect(new URL("/admin", request.url));
            }
            return NextResponse.next();
        }

        if (!token) {
            console.log("MIDDLEWARE_DEBUG: No token, redirecting to login");
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
        if (token.role !== "ADMIN" && token.role !== "OPERATOR") {
            console.log("MIDDLEWARE_DEBUG: Invalid role, redirecting to home", token.role);
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

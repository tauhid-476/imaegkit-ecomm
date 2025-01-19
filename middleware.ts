import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;

        // Allow webhook endpoint
        if (pathname.startsWith("/api/webhook")) {
          return true;
        }
        // Allow auth endpoints
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        ) {
          return true;``
        }
        //all the return true automatically invokes the middleware function

        if (
          pathname === "/" ||
          pathname === "/api/products" ||
          pathname === "/products"
        ) {
          return true;
        }

        if (pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }
        
        // all the other routes required authentication
        return !!token;
      },
    },
  }
);

export const config = {
    matcher: [
      /*
       * Match all request paths except:
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       * - public folder
       */
      "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ],
  };
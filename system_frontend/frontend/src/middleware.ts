// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { cookies } from "next/headers";

// export async function middleware(request: NextRequest) {
//   const cookieStore = cookies();
//   const accessToken = (await cookieStore).get("accessToken");

//   if (!accessToken && request.nextUrl.pathname !== "/") {
//     return NextResponse.redirect(new URL("/", request.url));
//   }
// }

// export const config = {
//   matcher: ["/((?!api|auth|_next/static|_next/image|.*\\.png$).*)"],
// };


import { NextResponse, NextRequest } from "next/server";

export default function Middleware(req: NextRequest) {
    const loggedIn = req.cookies.has('accessToken');
    const { pathname } = req.nextUrl;

    if (loggedIn && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }

    if (!loggedIn && pathname !== '/') {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|static|.*\\..*|_next).*)',
}
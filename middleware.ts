import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  // const { pathname } = url;

  // if (pathname === "/") {
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [],
};

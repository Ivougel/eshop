import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/s\/([^/]+)$/);
  if (!match) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/s/:sid"],
};

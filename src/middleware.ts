import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("ALL COOKIES:", req.cookies); // See if any cookies exist
  const token = req.cookies.get("token")?.value;
  console.log("middle ware ", token);
  

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/"]};

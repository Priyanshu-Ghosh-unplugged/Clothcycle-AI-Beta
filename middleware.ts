export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/profile/:path*", "/create/:path*", "/posts/:path*/edit"],
}

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in', '/sign-up', '/', '/home'])

const isPublicApiRoute = createRouteMatcher(['/api/videos'])

export default clerkMiddleware((auth, req) => {
  const { userId } = auth()
  const currentUrl = new URL(req.url)
  const isAccessingHome = currentUrl.pathname === '/home'
  const isApiRequest = currentUrl.pathname.startsWith('/api')

  if (currentUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  // when user is logged in
  if (userId && isPublicRoute(req) && !isAccessingHome) {
    return NextResponse.redirect(new URL('/home', req.url))
  }

  // user not logged in
  if (!userId) {
    // check if user is trying to access private routes
    if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }

    // check if user is trying to access private api routes
    if (isApiRequest && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}

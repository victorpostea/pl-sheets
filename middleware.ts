import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = new Set(['/', '/api/auth'])

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next()

  // Session content is validated in each route handler.
  // Middleware just redirects users who have no cookie at all.
  const sessionCookie = req.cookies.get('pl-session')
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

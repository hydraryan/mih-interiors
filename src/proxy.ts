import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Next.js 16 Proxy for subdomain-based routing.
 * 
 * On production (mihinteriors.in):
 *   services.mihinteriors.in/foo → rewrites to /services/foo
 *   projects.mihinteriors.in/foo → rewrites to /projects/foo
 *   blogs.mihinteriors.in/foo    → rewrites to /blogs/foo
 *   admin.mihinteriors.in/foo    → rewrites to /admin/foo
 *
 * On localhost:
 *   localhost:3000/services/foo → serves directly (no rewrite needed)
 *   services.localhost:3000/foo → rewrites to /services/foo
 */

const SUBDOMAIN_MAP = ['services', 'projects', 'blogs', 'admin']
const PUBLIC_ADMIN_PATHS = new Set(['/admin/login'])
const PROTECTED_API_PREFIXES = ['/api/admin']
const PROTECTED_MUTATION_PREFIXES = ['/api/blogs', '/api/projects', '/api/services']
const PROTECTED_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

function isProtectedMutation(pathname: string, method: string) {
  return PROTECTED_METHODS.has(method) && PROTECTED_MUTATION_PREFIXES.some((prefix) => {
    return pathname === prefix || pathname.startsWith(`${prefix}/`)
  })
}

function getSubdomain(hostname: string) {
  const host = hostname.split(':')[0]

  if (host === 'localhost' || host === '127.0.0.1') {
    return ''
  }

  if (host.endsWith('.localhost')) {
    return host.slice(0, -'.localhost'.length)
  }

  if (host.endsWith('.mihinteriors.in')) {
    return host.slice(0, -'.mihinteriors.in'.length)
  }

  return ''
}

export default async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  const currentHost = getSubdomain(hostname)
  const isApiPath = request.nextUrl.pathname === '/api' || request.nextUrl.pathname.startsWith('/api/')

  // If we detected a valid subdomain, rewrite the URL
  if (SUBDOMAIN_MAP.includes(currentHost) && !isApiPath) {
    // Avoid double-prefixing: if the path already starts with /subdomain, skip
    if (!url.pathname.startsWith(`/${currentHost}`)) {
      url.pathname = `/${currentHost}${url.pathname}`
    }
  }

  const pathname = url.pathname
  const method = request.method.toUpperCase()

  const requiresAuth =
    (!PUBLIC_ADMIN_PATHS.has(pathname) && pathname.startsWith('/admin')) ||
    PROTECTED_API_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)) ||
    isProtectedMutation(pathname, method)

  if (requiresAuth) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }

      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', `${pathname}${request.nextUrl.search}`)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (SUBDOMAIN_MAP.includes(currentHost) && !isApiPath && !request.nextUrl.pathname.startsWith(`/${currentHost}`)) {
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico|.*\\.webp).*)']
}

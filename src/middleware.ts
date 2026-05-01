import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PUBLIC_ADMIN_PATHS = new Set(['/admin/login'])
const PROTECTED_API_PREFIXES = ['/api/admin']
const PROTECTED_MUTATION_PREFIXES = ['/api/blogs', '/api/projects', '/api/services']
const PROTECTED_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

const MAIN_DOMAIN = 'mihinteriors.in'

export default async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  const pathname = url.pathname
  const method = request.method.toUpperCase()

  // 1. REDIRECT SUBDOMAINS TO MAIN DOMAIN PATHS
  // This honors the "remove all subdomains" request while helping the user transition.
  if (hostname.includes('admin.') && !pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL(`https://${MAIN_DOMAIN}/admin${pathname === '/' ? '' : pathname}`, request.url))
  }
  if (hostname.includes('services.') && !pathname.startsWith('/services')) {
    return NextResponse.redirect(new URL(`https://${MAIN_DOMAIN}/services${pathname === '/' ? '' : pathname}`, request.url))
  }
  if (hostname.includes('projects.') && !pathname.startsWith('/projects')) {
    return NextResponse.redirect(new URL(`https://${MAIN_DOMAIN}/projects${pathname === '/' ? '' : pathname}`, request.url))
  }
  if (hostname.includes('blogs.') && !pathname.startsWith('/blogs')) {
    return NextResponse.redirect(new URL(`https://${MAIN_DOMAIN}/blogs${pathname === '/' ? '' : pathname}`, request.url))
  }

  // 2. AUTHENTICATION PROTECTION
  const requiresAuth =
    (!PUBLIC_ADMIN_PATHS.has(pathname) && pathname.startsWith('/admin')) ||
    PROTECTED_API_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)) ||
    PROTECTED_METHODS.has(method) && PROTECTED_MUTATION_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))

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

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico|.*\\.webp).*)']
}

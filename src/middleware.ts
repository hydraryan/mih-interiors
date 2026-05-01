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

  // 1. FORCE CONSOLIDATION: Redirect ALL subdomain traffic to the main domain.
  // This is the cleanest way to "remove all subdomain things" and fix login.
  if (hostname.includes('admin.') || hostname.includes('services.') || hostname.includes('projects.') || hostname.includes('blogs.')) {
    // If the hostname contains a subdomain, redirect to the main domain immediately.
    // We preserve the path: admin.mihinteriors.in/login -> mihinteriors.in/admin/login (if needed)
    // Actually, simple concatenation is better:
    let targetPath = pathname
    if (hostname.startsWith('admin.') && !pathname.startsWith('/admin')) targetPath = `/admin${pathname === '/' ? '' : pathname}`
    if (hostname.startsWith('services.') && !pathname.startsWith('/services')) targetPath = `/services${pathname === '/' ? '' : pathname}`
    if (hostname.startsWith('projects.') && !pathname.startsWith('/projects')) targetPath = `/projects${pathname === '/' ? '' : pathname}`
    if (hostname.startsWith('blogs.') && !pathname.startsWith('/blogs')) targetPath = `/blogs${pathname === '/' ? '' : pathname}`

    return NextResponse.redirect(new URL(`https://${MAIN_DOMAIN}${targetPath}`, request.url))
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

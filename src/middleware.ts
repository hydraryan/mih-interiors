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

  const isApiPath = pathname.startsWith('/api/')

  // 1. STRICT DOMAIN CONSOLIDATION (NO REWRITES)
  // We strictly redirect all subdomains (admin, services, etc.) to their native paths on the main domain.
  if (hostname.includes('admin.') || hostname.includes('services.') || hostname.includes('projects.') || hostname.includes('blogs.')) {
    let targetPath = pathname
    
    // IMPORTANT FIX: Do NOT prepend /admin to API routes. They must remain /api/...
    if (hostname.startsWith('admin.') && !pathname.startsWith('/admin') && !isApiPath) {
      targetPath = `/admin${pathname === '/' ? '' : pathname}`
    }
    
    if (hostname.startsWith('services.') && !pathname.startsWith('/services') && !isApiPath) {
      targetPath = `/services${pathname === '/' ? '' : pathname}`
    }
    if (hostname.startsWith('projects.') && !pathname.startsWith('/projects') && !isApiPath) {
      targetPath = `/projects${pathname === '/' ? '' : pathname}`
    }
    if (hostname.startsWith('blogs.') && !pathname.startsWith('/blogs') && !isApiPath) {
      targetPath = `/blogs${pathname === '/' ? '' : pathname}`
    }
    
    // Preserve search params (like callbackUrl) during redirect
    return NextResponse.redirect(new URL(`https://${MAIN_DOMAIN}${targetPath}${request.nextUrl.search}`, request.url))
  }

  // 2. AUTHENTICATION PROTECTION
  const requiresAuth =
    (!PUBLIC_ADMIN_PATHS.has(pathname) && pathname.startsWith('/admin')) ||
    PROTECTED_API_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)) ||
    PROTECTED_METHODS.has(method) && PROTECTED_MUTATION_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))

  if (requiresAuth) {
    let token = null
    try {
      token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    } catch (err: any) {
      console.error('Middleware getToken error:', err?.message || err)
      token = null
    }

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }

      // Redirect to the same origin as the incoming request so cookies and callback URLs
      // remain consistent in development and production environments.
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      loginUrl.searchParams.set('callbackUrl', `${pathname}${request.nextUrl.search}`)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico|.*\\.webp).*)']
}

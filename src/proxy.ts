import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PUBLIC_ADMIN_PATHS = new Set(['/admin/login'])
const PROTECTED_API_PREFIXES = ['/api/admin']
const PROTECTED_MUTATION_PREFIXES = ['/api/blogs', '/api/projects', '/api/services']
const PROTECTED_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

const MAIN_DOMAIN = 'mihinteriors.in'
const LOCAL_DOMAIN = 'localhost:3000'

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  const pathname = url.pathname
  const method = request.method.toUpperCase()

  const isApiPath = pathname.startsWith('/api/')

  // Determine effective target path for rewrites
  let effectivePath = pathname
  
  if (hostname.startsWith('admin.') && !pathname.startsWith('/admin') && !isApiPath) {
    effectivePath = `/admin${pathname === '/' ? '' : pathname}`
  } else if (hostname.startsWith('services.') && !pathname.startsWith('/services') && !isApiPath) {
    effectivePath = `/services${pathname === '/' ? '' : pathname}`
  } else if (hostname.startsWith('projects.') && !pathname.startsWith('/projects') && !isApiPath) {
    effectivePath = `/projects${pathname === '/' ? '' : pathname}`
  } else if (hostname.startsWith('blogs.') && !pathname.startsWith('/blogs') && !isApiPath) {
    effectivePath = `/blogs${pathname === '/' ? '' : pathname}`
  }

  // 1.5. ENFORCE ADMIN SUBDOMAIN
  // We determine if the intent is to access admin based on either the requested URL or the fact that it's the admin root.
  const isRequestingAdminUrl = pathname.startsWith('/admin') || pathname === '/login'
  const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1')
  const baseDomain = isLocal ? LOCAL_DOMAIN : MAIN_DOMAIN
  const adminDomain = `admin.${baseDomain}`
  
  if (process.env.NODE_ENV === 'production' || isLocal) {
    // 1. If accessing an explicit /admin path on the main domain -> redirect to admin subdomain
    if (isRequestingAdminUrl && !hostname.startsWith('admin.')) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.host = adminDomain
      // Remove the /admin prefix since admin subdomain maps to it
      redirectUrl.pathname = pathname.replace(/^\/admin/, '') || '/'
      if (!isLocal) redirectUrl.port = ''
      return NextResponse.redirect(redirectUrl)
    }

    // 2. If accessing a non-admin path on the admin subdomain -> redirect to main domain
    // (Note: The root '/' on admin subdomain is implicitly the admin dashboard, so we allow it)
    const isRootOnAdmin = hostname.startsWith('admin.') && pathname === '/'
    if (!isRequestingAdminUrl && hostname.startsWith('admin.') && !isRootOnAdmin && !isApiPath && !pathname.startsWith('/_next')) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.host = baseDomain
      if (!isLocal) redirectUrl.port = ''
      return NextResponse.redirect(redirectUrl)
    }
  }

  // 2. AUTHENTICATION PROTECTION
  const requiresAuth =
    (!PUBLIC_ADMIN_PATHS.has(effectivePath) && effectivePath.startsWith('/admin')) ||
    PROTECTED_API_PREFIXES.some((prefix) => effectivePath === prefix || effectivePath.startsWith(`${prefix}/`)) ||
    (PROTECTED_METHODS.has(method) && PROTECTED_MUTATION_PREFIXES.some((prefix) => effectivePath === prefix || effectivePath.startsWith(`${prefix}/`)))

  if (requiresAuth) {
    let token = null
    try {
      // Bulletproof token extraction: Check both secure and insecure prefixed cookies
      // Vercel Edge middleware sometimes disagrees with Node API routes on whether a request is secure.
      token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET, secureCookie: true })
           || await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET, secureCookie: false })
    } catch (err: any) {
      console.error('Middleware getToken error:', err?.message || err)
      token = null
    }

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }

      // Redirect to login using the appropriate path for the current domain
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = hostname.startsWith('admin.') ? '/login' : '/admin/login'
      loginUrl.searchParams.set('callbackUrl', `${request.nextUrl.pathname}${request.nextUrl.search}`)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Handle response and add security headers
  let response = NextResponse.next()

  // Rewrite if the effective path is different from the requested path (for subdomains)
  if (effectivePath !== pathname) {
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = effectivePath
    response = NextResponse.rewrite(rewriteUrl)
  }

  // Apply Security Headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico|.*\\.webp|.*\\.webmanifest).*)']
}

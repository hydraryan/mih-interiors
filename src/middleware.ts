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

  // Rewrite if the effective path is different from the requested path (for subdomains)
  if (effectivePath !== pathname) {
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = effectivePath
    return NextResponse.rewrite(rewriteUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico|.*\\.webp).*)']
}

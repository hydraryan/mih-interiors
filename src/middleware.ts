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

  // 1. ADMIN SUBDOMAIN REWRITE
  // Only rewrite non-API paths for the admin subdomain
  if (hostname.startsWith('admin.') && !isApiPath) {
    if (!pathname.startsWith('/admin')) {
      url.pathname = `/admin${pathname === '/' ? '' : pathname}`
    }
  } else if (!hostname.startsWith('admin.') && !hostname.startsWith(MAIN_DOMAIN)) {
    // 2. CONSOLIDATE OTHER SUBDOMAINS (Services, Projects, Blogs) to Main Domain
    if (hostname.includes('services.') || hostname.includes('projects.') || hostname.includes('blogs.')) {
      let targetPath = pathname
      if (hostname.startsWith('services.') && !pathname.startsWith('/services')) targetPath = `/services${pathname === '/' ? '' : pathname}`
      if (hostname.startsWith('projects.') && !pathname.startsWith('/projects')) targetPath = `/projects${pathname === '/' ? '' : pathname}`
      if (hostname.startsWith('blogs.') && !pathname.startsWith('/blogs')) targetPath = `/blogs${pathname === '/' ? '' : pathname}`
      return NextResponse.redirect(new URL(`https://${MAIN_DOMAIN}${targetPath}`, request.url))
    }
  }

  const finalPathname = url.pathname

  // 3. AUTHENTICATION PROTECTION
  const requiresAuth =
    (!PUBLIC_ADMIN_PATHS.has(finalPathname) && finalPathname.startsWith('/admin')) ||
    PROTECTED_API_PREFIXES.some((prefix) => finalPathname === prefix || finalPathname.startsWith(`${prefix}/`)) ||
    PROTECTED_METHODS.has(method) && PROTECTED_MUTATION_PREFIXES.some((prefix) => finalPathname === prefix || finalPathname.startsWith(`${prefix}/`))

  if (requiresAuth) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      if (finalPathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }

      // Ensure login redirect goes to the correct domain/path
      const loginTarget = hostname.startsWith('admin.') 
        ? new URL('/admin/login', request.url)
        : new URL(`https://${MAIN_DOMAIN}/admin/login`, request.url)
      
      loginTarget.searchParams.set('callbackUrl', `${pathname}${request.nextUrl.search}`)
      return NextResponse.redirect(loginTarget)
    }
  }

  // If we performed a rewrite for the admin subdomain, return the rewrite
  if (hostname.startsWith('admin.') && !isApiPath && url.pathname !== pathname) {
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico|.*\\.webp).*)']
}

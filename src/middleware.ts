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

  // 1. ADMIN SUBDOMAIN REWRITE
  // If user is on admin.mihinteriors.in, we rewrite /foo to /admin/foo
  if (hostname.startsWith('admin.')) {
    if (!pathname.startsWith('/admin')) {
      url.pathname = `/admin${pathname === '/' ? '' : pathname}`
      // IMPORTANT: After rewriting, we proceed to check auth on the rewritten path
    }
  } else {
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

      const loginUrl = new URL('/admin/login', request.url)
      // If we are on the subdomain, loginUrl will be admin.mihinteriors.in/admin/login
      // which our middleware handles (no redirect loop because of startsWith('/admin') check above)
      loginUrl.searchParams.set('callbackUrl', `${pathname}${request.nextUrl.search}`)
      return NextResponse.redirect(loginUrl)
    }
  }

  // If we performed a rewrite for the admin subdomain, return the rewrite
  if (hostname.startsWith('admin.') && url.pathname !== pathname) {
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico|.*\\.webp).*)']
}

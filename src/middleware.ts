import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PUBLIC_ADMIN_PATHS = new Set(['/admin/login'])
const PROTECTED_API_PREFIXES = ['/api/admin']
const PROTECTED_MUTATION_PREFIXES = ['/api/blogs', '/api/projects', '/api/services']
const PROTECTED_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

function isProtectedMutation(pathname: string, method: string) {
  return PROTECTED_METHODS.has(method) && PROTECTED_MUTATION_PREFIXES.some((prefix) => {
    return pathname === prefix || pathname.startsWith(`${prefix}/`)
  })
}

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname
  const method = request.method.toUpperCase()
  const host = request.headers.get('host') || ''

  // Subdomain handling: Rewrite admin subdomain to /admin path
  let finalPathname = pathname
  if (host.startsWith('admin.')) {
    if (!pathname.startsWith('/admin')) {
      finalPathname = `/admin${pathname === '/' ? '' : pathname}`
    }
  }

  const requiresAuth =
    (!PUBLIC_ADMIN_PATHS.has(finalPathname) && finalPathname.startsWith('/admin')) ||
    PROTECTED_API_PREFIXES.some((prefix) => finalPathname === prefix || finalPathname.startsWith(`${prefix}/`)) ||
    isProtectedMutation(finalPathname, method)

  if (requiresAuth) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      if (finalPathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }

      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', `${pathname}${request.nextUrl.search}`)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Rewrite if the final path differs from the requested path (subdomain case)
  if (finalPathname !== pathname) {
    url.pathname = finalPathname
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico|.*\\.webp).*)']
}

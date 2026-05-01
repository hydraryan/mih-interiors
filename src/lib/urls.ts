/**
 * URL utility for subdomain routing.
 * Generates correct links for both localhost and production environments.
 *
 * Usage:
 *   import { getUrl } from '@/lib/urls'
 *   <Link href={getUrl('services', '/residential')}>...</Link>
 *   <Link href={getUrl('', '/about')}>...</Link>   // main domain
 */

const PRODUCTION_DOMAIN = 'mihinteriors.in'

/**
 * Returns the correct URL for a given subdomain and path,
 * working on both localhost:3000 and production.
 *
 * @param subdomain - '' for main domain, or 'services' | 'projects' | 'blogs' | 'admin'
 * @param path - the path portion, e.g. '/residential' or '/'
 */
export function getUrl(subdomain: string, path: string = '/'): string {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`

  if (typeof window !== 'undefined') {
    const host = window.location.host // e.g. 'localhost:3000' or 'mihinteriors.in'
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1')

    if (isLocal) {
      // On localhost, use path-based routing: /services/..., /projects/..., etc.
      if (!subdomain) return cleanPath
      return `/${subdomain}${cleanPath === '/' ? '' : cleanPath}`
    }

    // Production: use subdomain-based routing
    if (!subdomain) return `https://${PRODUCTION_DOMAIN}${cleanPath}`
    return `https://${subdomain}.${PRODUCTION_DOMAIN}${cleanPath}`
  }

  // Server-side fallback: use path-based routing (safe for both environments)
  if (!subdomain) return cleanPath
  return `/${subdomain}${cleanPath === '/' ? '' : cleanPath}`
}

/**
 * Subdomain route helpers for convenience
 */
export const urls = {
  home: (path: string = '/') => getUrl('', path),
  services: (path: string = '/') => getUrl('services', path),
  projects: (path: string = '/') => getUrl('projects', path),
  blogs: (path: string = '/') => getUrl('blogs', path),
  admin: (path: string = '/') => getUrl('admin', path),
}

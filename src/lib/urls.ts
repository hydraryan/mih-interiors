/**
 * URL utility for standard path-based routing with dedicated admin subdomain.
 */

const PRODUCTION_DOMAIN = 'mihinteriors.in'

export function getUrl(subdomain: string, path: string = '/'): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  
  if (typeof window !== 'undefined') {
    const host = window.location.host
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1')

    if (isLocal) {
      if (!subdomain) return cleanPath
      return `/${subdomain}${cleanPath === '/' ? '' : cleanPath}`
    }

    // Production: Only 'admin' uses a subdomain now
    if (subdomain === 'admin') {
      return `https://admin.${PRODUCTION_DOMAIN}${cleanPath}`
    }

    // All other subdomains (services, etc) are now path-based
    if (!subdomain) return cleanPath
    return `/${subdomain}${cleanPath === '/' ? '' : cleanPath}`
  }

  // Server-side fallback
  if (subdomain === 'admin') return `https://admin.${PRODUCTION_DOMAIN}${cleanPath}`
  if (!subdomain) return cleanPath
  return `/${subdomain}${cleanPath === '/' ? '' : cleanPath}`
}

export const urls = {
  home: (path: string = '/') => getUrl('', path),
  services: (path: string = '/') => getUrl('services', path),
  projects: (path: string = '/') => getUrl('projects', path),
  blogs: (path: string = '/') => getUrl('blogs', path),
  admin: (path: string = '/') => getUrl('admin', path),
}

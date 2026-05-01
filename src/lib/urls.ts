/**
 * URL utility for standard path-based routing.
 */

export function getUrl(subdomain: string, path: string = '/'): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  
  if (!subdomain) return cleanPath
  
  // Revert all subdomain names to root-level paths
  return `/${subdomain}${cleanPath === '/' ? '' : cleanPath}`
}

export const urls = {
  home: (path: string = '/') => getUrl('', path),
  services: (path: string = '/') => getUrl('services', path),
  projects: (path: string = '/') => getUrl('projects', path),
  blogs: (path: string = '/') => getUrl('blogs', path),
  admin: (path: string = '/') => getUrl('admin', path),
}

import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const adminLoginPath = '/admin/login'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin credentials',
      credentials: {
        adminId: { label: 'Admin ID', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const adminId = process.env.ADMIN_ID?.trim()
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminId || !adminPassword) {
          console.error('CRITICAL: ADMIN_ID and ADMIN_PASSWORD are not configured in environment variables.')
          throw new Error('Server configuration error.')
        }

        if (
          credentials?.adminId?.trim() === adminId &&
          credentials?.password === adminPassword
        ) {
          return {
            id: adminId,
            name: 'Mohit Mahajan',
            email: 'admin@mihinteriors.in',
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: adminLoginPath,
  },
  session: {
    strategy: 'jwt',
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // In production, we use the base domain to share session across all subdomains
        domain: process.env.NODE_ENV === 'production' ? '.mihinteriors.in' : 'localhost',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
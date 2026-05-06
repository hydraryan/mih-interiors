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

        // Help debug in Vercel logs (without showing password)
        console.log('Login attempt for ID:', credentials?.adminId)
        console.log('Configured Admin ID exists:', !!adminId)
        console.log('Configured Password exists:', !!adminPassword)

        if (!adminId || !adminPassword) {
          console.error('CRITICAL: ADMIN_ID and ADMIN_PASSWORD are not configured in environment variables.')
          throw new Error('Server configuration error.')
        }

        if (
          credentials?.adminId?.trim() === adminId &&
          credentials?.password === adminPassword
        ) {
          console.log('Login successful for:', adminId)
          return {
            id: adminId,
            name: 'Mohit Mahajan',
            email: 'admin@mihinteriors.in',
          }
        }

        console.warn('Login failed: Invalid credentials.')
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
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV !== 'production',
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      // Log token lifecycle for debugging authentication flow on the server
      // eslint-disable-next-line no-console
      console.log('NextAuth jwt callback:', { token: { ...token }, user: !!user, account: !!account, isNewUser })
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      // Attach token info to session for server-side checks and logging
      // eslint-disable-next-line no-console
      console.log('NextAuth session callback:', { session: !!session, token: !!token })
      if (token?.user) {
        session.user = token.user as any
      }
      return session
    },
  },
}
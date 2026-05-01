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
          throw new Error('ADMIN_ID and ADMIN_PASSWORD must be configured before admin sign-in.')
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
  secret: process.env.NEXTAUTH_SECRET,
}
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@/lib/mongodb'
import AdminUser from '@/lib/models/AdminUser'
import { verifyPassword } from '@/lib/security'

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
        try {
          const adminId = credentials?.adminId?.trim().toLowerCase()
          const password = credentials?.password || ''

          if (!adminId || !password) {
            return null
          }

          await dbConnect()
          const admin = await AdminUser.findOne({ adminId, isActive: true })
          if (!admin) {
            return null
          }

          const isValidPassword = await verifyPassword(password, admin.passwordHash)
          if (!isValidPassword) {
            return null
          }

          await AdminUser.updateOne({ _id: admin._id }, { $set: { lastLoginAt: new Date() } })

          return {
            id: admin.adminId,
            name: admin.name || 'MIH Admin',
            email: admin.email || 'admin@mihinteriors.in',
            role: admin.role || 'admin',
          }
        } catch (error) {
          console.error('Admin login failed:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: adminLoginPath,
  },
  session: {
    strategy: 'jwt',
    maxAge: 2 * 60 * 60, // 2 hours for enhanced security
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.mihinteriors.in' : undefined,
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production',
  callbacks: {
    async jwt({ token, user, account, isNewUser }) {
      // Log token lifecycle for debugging authentication flow on the server
      console.log('NextAuth jwt callback:', { token: { ...token }, user: !!user, account: !!account, isNewUser })
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      // Attach token info to session for server-side checks and logging
      console.log('NextAuth session callback:', { session: !!session, token: !!token })
      if (token?.user) {
        session.user = token.user as typeof session.user
      }
      return session
    },
  },
}
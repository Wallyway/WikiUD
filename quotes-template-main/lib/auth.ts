import { getMongoClient } from './db'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { NextAuthOptions } from 'next-auth'
import AzureADProvider from "next-auth/providers/azure-ad"
import { AuthServiceImpl } from './services/auth.service'
import { getServerSession } from 'next-auth'

const authService = new AuthServiceImpl()

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(getMongoClient()),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    AzureADProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      return authService.handleSession(token, session)
    },

    async jwt({ token, user }) {
      return authService.handleJWT(token, user)
    },

    redirect() {
      return '/dashboard'
    },
  },
}

export const getAuthSession = () => getServerSession(authOptions)

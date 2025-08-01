import { getMongoClient } from './db'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth from "next-auth"
import { AuthServiceImpl } from './services/auth.service'
import authConfig from "../auth.config"

const authService = new AuthServiceImpl()

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(getMongoClient()),
  session: {
    strategy: 'jwt',
  },
  ...authConfig,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ token, session }) {
      return authService.handleSessionWithToken(token, session)
    },

    async jwt({ token, user }) {
      return authService.handleJWT(token, user)
    },

    redirect() {
      return '/dashboard'
    },

  },
})

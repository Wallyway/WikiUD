import { getMongoClient } from '../lib/db'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { NextAuthOptions, getServerSession } from 'next-auth'
import AzureADProvider from "next-auth/providers/azure-ad"
import { nanoid } from 'nanoid'

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
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.username = token.username
      }
      return session
    },

    async jwt({ token, user }) {
      const client = await getMongoClient()
      const db = client.db()

      // Find user by email
      const dbUser = await db.collection("users").findOne({ email: token.email })

      if (!dbUser) {
        token.id = user!.id
        return token
      }

      if (!dbUser.username) {
        // Generate a new username if not present
        const newUsername = nanoid(10)

        await db.collection("users").updateOne(
          { _id: dbUser._id },
          { $set: { username: newUsername } }
        )

        dbUser.username = newUsername
      }

      return {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      }
    },
    
    redirect() {
      return '/dashboard'
    },
  },
}

export const getAuthSession = () => getServerSession(authOptions)

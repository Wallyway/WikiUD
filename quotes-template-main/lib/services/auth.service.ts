import { getMongoClient } from '../db'
import { nanoid } from 'nanoid'
import { AuthService } from '@/types/next-auth'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth'
import { Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export class AuthServiceImpl implements AuthService {
    private async getDb() {
        const client = await getMongoClient()
        return client.db()
    }

    async getSession(): Promise<Session | null> {
        return getServerSession(authOptions)
    }

    async handleJWT(token: JWT, user: User): Promise<JWT> {
        const db = await this.getDb()
        const dbUser = await db.collection("users").findOne({ email: token.email })

        if (!dbUser) {
            token.id = user.id
            return token
        }

        if (!dbUser.username) {
            const newUsername = this.generateUsername()
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
    }

    async handleSession(token: JWT, session: Session): Promise<Session> {
        if (token) {
            session.user.id = token.id
            session.user.name = token.name
            session.user.email = token.email
            session.user.image = token.picture
            session.user.username = token.username
        }
        return session
    }

    generateUsername(): string {
        return nanoid(10)
    }
} 
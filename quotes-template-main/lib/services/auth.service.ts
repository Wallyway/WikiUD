import { getMongoClient } from '../db'
import { nanoid } from 'nanoid'
import { AuthService } from '@/types/next-auth'
import { Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'

/**
 * Implementation of the AuthService interface that handles authentication operations
 * using MongoDB as the database backend.
 */
export class AuthServiceImpl implements AuthService {
    /**
     * Gets a MongoDB database instance.
     * @private "Other classes or components shouldn't need to know how the database connection is obtained"
     * @returns Promise resolving to the MongoDB database instance
     */

    private async getDb() {
        const client = await getMongoClient()
        return client.db()
    }

    /**
     * Retrieves the current user session using NextAuth.
     * @returns Promise resolving to the current Session object or null if no session exists
     */
    async getSession(): Promise<Session | null> {
        // This will be handled by the auth callback, not directly here
        return null
    }

    /**
     * Processes JWT token and synchronizes user data with the database.
     * If the user doesn't exist in the database, it creates a new entry.
     * If the user exists but has no username, it generates one.
     * 
     * @param token - The JWT token to process
     * @param user - The user object containing authentication data
     * @returns Promise resolving to the processed JWT token with updated user information
     */
    async handleJWT(token: JWT, user: User): Promise<JWT> {
        const db = await this.getDb()
        const dbUser = await db.collection("users").findOne({ email: token.email })

        if (!dbUser) {
            // Create new user if they don't exist
            const newUser = {
                email: token.email,
                name: token.name,
                image: token.picture,
                username: this.generateUsername(),
                createdAt: new Date(),
            }

            const result = await db.collection("users").insertOne(newUser)

            return {
                id: result.insertedId.toString(),
                name: newUser.name,
                email: newUser.email,
                picture: newUser.image,
                username: newUser.username,
            }
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

    /**
     * Updates the session object with user information from the database user.
     * 
     * @param user - The database user object containing user information
     * @param session - The current session object to update
     * @returns Promise resolving to the updated Session object
     */
    async handleSession(user: any, session: Session): Promise<Session> {
        if (user) {
            session.user.id = user.id
            session.user.name = user.name
            session.user.email = user.email
            session.user.image = user.image
            session.user.username = user.username
        }
        return session
    }

    /**
     * Updates the session object with user information from the JWT token.
     * 
     * @param token - The JWT token containing user information
     * @param session - The current session object to update
     * @returns Promise resolving to the updated Session object
     */
    async handleSessionWithToken(token: JWT, session: Session): Promise<Session> {
        if (token) {
            session.user.id = token.id
            session.user.name = token.name
            session.user.email = token.email
            session.user.image = token.picture
            session.user.username = token.username
        }
        return session
    }

    /**
     * Generates a unique username using nanoid.
     * @returns A string containing a 10-character unique username
     */
    generateUsername(): string {
        return nanoid(10)
    }
} 
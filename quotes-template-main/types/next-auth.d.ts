import type { Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

type UserId = string

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId
    username?: string | null
  }
}

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: UserId
      username?: string | null
    }
  }
}

/**
 * @interface AuService
 * Interface that defines the authentication service contract.
 * This service handles user authentication, session management, and JWT token operations.
 *

  * ---> @function getSession the current user session.
  * @returns Promise resolving to the current Session object or null if no session exists
  * 
  * ---> @function handleJWT
  * Handles JWT token operations and user data synchronization.
  * @param token - The JWT token to process
  * @param user - The user object containing authentication data
  * @returns Promise resolving to the processed JWT token
  * 
  * ---> @function handleSession
  * Processes and updates the session with token data.
  * @param token - The JWT token containing user information
  * @param session - The current session object to update
  * @returns Promise resolving to the updated Session object
  * 
  * ---> @function generateUsername
  * Generates a unique username for new users.
  * @returns A string containing the generated username
*/
export interface AuthService {
  getSession(): Promise<Session | null>
  handleJWT(token: JWT, user: User): Promise<JWT>
  handleSession(token: JWT, session: Session): Promise<Session>
  generateUsername(): string
}
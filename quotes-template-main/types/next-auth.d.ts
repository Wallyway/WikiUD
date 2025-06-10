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

export interface AuthService {
  getSession(): Promise<Session | null>
  handleJWT(token: JWT, user: User): Promise<JWT>
  handleSession(token: JWT, session: Session): Promise<Session>
  generateUsername(): string
}
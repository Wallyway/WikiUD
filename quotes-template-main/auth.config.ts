import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"
import type { NextAuthConfig } from "next-auth"
 
// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [MicrosoftEntraID({
    clientId: process.env.MICROSOFT_CLIENT_ID!,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    allowDangerousEmailAccountLinking: true,
  })],
} satisfies NextAuthConfig
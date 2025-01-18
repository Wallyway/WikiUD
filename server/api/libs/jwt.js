
import jwt from "jsonwebtoken"
import { TOKEN_SECRET } from "../config/token.js"


/**
 * Creates a JWT access token with the given payload
 * @param {Object} payload - Data to be encoded in the token
 * @returns {Promise<string>} Promise that resolves to the JWT token string
 * @throws {Error} If token generation fails
 * 
 * @example
 * const payload = { userId: '123' };
 * const token = await createAccessToken(payload);
 * 
 * @description
 * This function creates a JSON Web Token (JWT) using the provided payload.
 * The token is signed using TOKEN_SECRET and expires in 1 day.
 * Returns a Promise that resolves with the generated token string or rejects with an error.
 */


export function createAccessToken(payload){
   return new Promise((resolve, reject) => {
    jwt.sign(
        payload,
        TOKEN_SECRET,
        {
            expiresIn: "1d"
        },
        (err, token) => {
            // Callback handling token generation
            if(err) reject(err)
            resolve(token)
        }  
    )
   })
}

import jwt from "jsonwebtoken"
import { TOKEN_SECRET } from "../config/token.js"


/**
* Generate JWT token for authenticated user
* @param {Object} userSaved - Mongoose user document with _id
* @returns {Object} response with JWT token
* 
* Process:
* 1. Signs token with user ID as payload
* 2. Uses 'secret123' as JWT secret key (should use env variable)
* 3. Sets token expiration to 1 day
* 4. Returns token with cookies or logs error
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

import User from '../../models/userModel.js';
import bcrypt from 'bcrypt';
import { createAccessToken } from '../../libs/jwt.js';

/**
 * Registers a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {string} req.body.username - The username of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user is registered.
 * @throws {Error} - Throws an error if registration fails.
 *
 * The function performs the following steps:
 * 1. Extracts email, password, and username from the request body.
 * 2. Hashes the password using bcrypt with a salt round of 10.
 * 3. Creates a new user instance with the hashed password.
 * 4. Saves the new user to the database using Mongoose.
 * 5. Generates a JWT token for the newly registered user.
 * 6. Sets the JWT token as a cookie in the response.
 * 7. Sends a JSON response containing the user's id, username, email, createdAt, and updatedAt fields.
 * 8. Logs an error message if registration fails.
 */

export const register = async (req, res) =>  {
    /*1*/const {email,password, username} = req.body;
    try {
        /*2*/const passwordHash = await bcrypt.hash(password, 10)  

        const newUSer = new User({
            username,
            email,
            password:passwordHash
        })

        const userSaved = await newUSer.save();        
        const token = await createAccessToken({id:userSaved._id})     
        res.cookie('token', token)                      
        res.json({
            id: userSaved._id,                          
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt
        })   

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
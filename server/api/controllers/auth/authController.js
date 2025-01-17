import User from '../../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) =>  {
    const {email,password, username} = req.body;
    try {
        const passwordHash = await bcrypt.hash(password, 10)  //10 is the number of times that the password will be hashed

        const newUSer = new User({
            username,
            email,
            password:passwordHash
        })

        const userSaved = await newUSer.save();     //moongose method to save the data in the database

        /**
         * Generate JWT token for authenticated user
         * @param {Object} userSaved - Mongoose user document with _id
         * @returns {Object} response with JWT token
         * 
         * Process:
         * 1. Signs token with user ID as payload
         * 2. Uses 'secret123' as JWT secret key (should use env variable)
         * 3. Sets token expiration to 1 day
         * 4. Returns token in response or logs error
         */
        jwt.sign(
            {   
                // Include user ID in token payload                               
                id: userSaved._id,
            }, 
            'secret123', // JWT secret key - TODO: Move to env variable
            {
                expiresIn: "1d" // Token expires in 1 day
            },
            (err, token) => {
                // Callback handling token generation
                if(err) console.log('Error generating token:', err)
                res.json({token}) // Return token to client
            }  
        )

        res.json({
            id: userSaved._id,                              //Data that we want to send to the client
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt
        })
    } catch (error) {
        console.error('Registration failed:', error.message);
    }
    //Intance an Object, this is better because let us manage the data
    

}

export const login = (req, res) => res.send('Login')
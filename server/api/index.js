import express from 'express';
import morgan from 'morgan';
// import cors from 'cors';
import connectDB from "../application/database/mongodb.js";
import User from "./models/userModel.js";

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(morgan('dev'));
// app.use(cors());
app.use(express.json());

// Routes
app.get("/api", (req, res) => {
    res.send("Hola desde el servidor!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// const registerUser = async (id,username, email, password) => {  //TODO: It will be implemented in the future (It works)
//     try {
//       const user = new User({id, username, email, password });
//       await user.save();
//       console.log('User registered:', user);
//     } catch (error) {
//       console.error('Registration failed:', error.message);
//     }
//   };
  
//   registerUser( '1424365356334432','John Doe', 'john.doe@example.com', 'password123');

export default app;
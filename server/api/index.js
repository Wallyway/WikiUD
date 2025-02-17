import express from "express";
import morgan from "morgan";
// import cors from 'cors';
import connectDB from "./database/mongodb.js";
import authRegister from "../api/routes/auth/registerRouter.js";
import authLogin from "../api/routes/auth/loginRouter.js";
import routerApi from "./routes/index.js";

/**
 * @constant {number} PORT - The port number for the server to listen on.
 * Falls back to 3000 if process.env.PORT is not defined.
 */
/**
 * @constant {number} PORT
 * @description Port number for server configuration. Uses the environment variable PORT if available,
 * otherwise defaults to 3000. This allows for flexible deployment where the port can be set via
 * environment variables in production while maintaining a default for development.
 */

// Initialize Express
const app = express();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(authRegister, authLogin);

routerApi(app);

// Routes
app.get("/api", (req, res) => {
  res.send("Hola desde el servidor!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

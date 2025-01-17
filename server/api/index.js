import app from "../application/app.js"
import connectDB from "../application/database/mongodb.js";

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Initialize Express
app.get("/api", (req, res) => {
    res.send("Hola desde el servidor!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
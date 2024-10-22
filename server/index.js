import app from "./app.js"
import consumeMessages from "./consumer.js";
import connectDB from "./db.js";
import publishMessage from "./publisher.js";


connectDB();

app.get("/app", (req, res) => {
    const message = "Hola desde el servidor!";
    publishMessage('helloQueue', message);
    res.json({ message});
    consumeMessages('helloQueue');
});

app.listen(3000)
console.log('Server on port', 3000)
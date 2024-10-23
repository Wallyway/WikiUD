import amqp from 'amqplib/callback_api.js';
import connectDB from './db.js';
import Message from './models/message.model.js';


//Conexion a MongoDB
connectDB();

function consumeMessages(queue) {
    amqp.connect('amqp://localhost', (err, connection) => {
        if (err) {
            console.error('Failed to connect to RabbitMQ:', err);
            throw err;
        }
        connection.createChannel((err, channel) => {
            if (err) {
                console.error('Failed to create channel:', err);
                throw err;
            }
            channel.assertQueue(queue, {
                durable: false
            });
            console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);
            channel.consume(queue, async (msg) => {
                const messageContent = msg.content.toString();
                console.log(`Received: ${messageContent}`);

                //Guardar mensaje en MongoDB
                const message = new Message({ content: messageContent });
                await message.save();
                console.log('Message saved in MongoDB');
            }, {
                noAck: true
            });
        });
    });
}


export default consumeMessages;
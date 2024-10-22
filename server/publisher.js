import amqp from 'amqplib/callback_api.js';


function publishMessage(queue, message){
    amqp.connect('amqp://localhost', (err, connection) => {
        if(err){
            console.error('Failed to connect to RabbitMQ:', err);
            throw err;
        }
        connection.createChannel((err, channel) => {
            if(err){
                console.error('Failed to create channel:', err);
                throw err;
            }
            channel.assertQueue(queue, {
                durable: false
            });
            channel.sendToQueue(queue, Buffer.from(message));
            console.log(`Message: ${message} sent to queue: ${queue}`);
        });

        setTimeout(() => {
            connection.close();
        }, 500);
    });
}

export default publishMessage;
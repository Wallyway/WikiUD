import publishMessage from './publisher.js';

const queue = 'helloQueue';
const message = 'Hello from the publisher!';

publishMessage(queue, message);
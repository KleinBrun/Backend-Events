require('dotenv').config();
const amqp = require('amqplib');
const { logError } = require("./helpers/errorLogger");

const rabbitmqConnection = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue('logs_queue', { durable: true });
        console.log('Conectado a RabbitMQ');
        return channel;
    } catch (error) {
        await logError(error, 'Error al conectar a RabbitMQ');
    }
};

module.exports = { rabbitmqConnection };
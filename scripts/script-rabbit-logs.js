const { dbConection } = require('../database/config');
const { logError } = require('../helpers/errorLogger');
const { rabbitmqConnection } = require('../rabbitmq');

const processLogs = async () => {
    try {
        const channel = await rabbitmqConnection();
        const db = await dbConection();
        const logsCollection = db.collection('EventLogs');

        channel.consume('logs_queue', async (msg) => {
            if (msg !== null) {
                const log = JSON.parse(msg.content.toString());
                await logsCollection.insertOne(log);
                channel.ack(msg);
            }
        });
    } catch (error) {
        await logError(error, 'Error al consumir logs de RabbitMQ');
        throw error;
    }
};

module.exports = {
    processLogs
}

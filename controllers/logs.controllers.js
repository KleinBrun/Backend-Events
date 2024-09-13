const { response, request } = require("express");
const { dbConection } = require("../database/config");
const { rabbitmqConnection } = require("../rabbitmq");
const { logError } = require("../helpers/errorLogger");
const date = require('date-and-time');

const logsGet = async (req = request, res = response) => {
    try {
        const db = await dbConection();
        const logsCollection = db.collection('EventLogs');
        const logs = await logsCollection.aggregate([{ $sort: { create_at: -1 } }]).toArray();

        return res.status(200).json({ logs });
    } catch (error) {
        await logError(error, 'Error al obtener los logs');
        return res.status(500).json({
            msg: 'Error al obtener los logs',
            error
        });
    }
}

const logsPost = async (req, res = response) => {
    try {
        const channel = await rabbitmqConnection();
        const logs = req.body;

        if (!Array.isArray(logs)) {
            return res.status(400).json({
                msg: 'El cuerpo de la solicitud debe ser un array de logs.',
            });
        }

        logs.forEach(log => {
            const newLog = {
                event_type: log.event_type,
                description: log.description,
                event_date: date.format(new Date(log.event_date), 'YYYY/MM/DD HH:mm:ss'),
                create_at: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
            };
            channel.sendToQueue('logs_queue', Buffer.from(JSON.stringify(newLog)), {
                persistent: true
            });
        });

        return res.status(202).json({
            msg: 'Logs enviados a la cola correctamente'
        });
    } catch (error) {
        await logError(error, 'Error al enviar los logs a RabbitMQ');
        return res.status(500).json({
            msg: 'Error al enviar los logs',
            error
        });
    }
}

const logPost = async (req, res = response) => {
    try {
        const { event_date, description, event_type } = req.body;
        const db = await dbConection();
        const logsCollection = db.collection('EventLogs');

        const newLog = {
            event_type: event_type,
            description: description,
            event_date: date.format(new Date(event_date), 'YYYY/MM/DD HH:mm:ss'),
            create_at: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
        };

        await logsCollection.insertOne(newLog);

        res.status(201).json({
            message: 'Log created successfully',
            log: newLog
        });
    } catch (error) {
        await logError(error, 'Error al Guardar el Log por el Formulario');
        return res.status(500).json({
            msg: 'Error al Guardar el Log por el Formulario',
            error
        });
    }
}

module.exports = {
    logsGet,
    logsPost,
    logPost
}
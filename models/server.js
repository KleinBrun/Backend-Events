const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { processLogs } = require('../scripts/script-rabbit-logs');
const date = require('date-and-time');
const { validateSecretKey } = require('../middlewares/auth-middleware');
const fs = require('fs');
const path = require('path');
const https = require('https');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            logs: '/api/logs',
        };

        this.certOptions = {
            key: fs.readFileSync(path.join(__dirname, '../certs/private.key')),
            cert: fs.readFileSync(path.join(__dirname, '../certs/certificate.crt'))
        };

        this.middlewares();
        this.routes();
        this.cron();
    }

    middlewares() {
        const corsOptions = {
            origin: ['http://localhost:3000', 'https://staging.d1o22k5pthccw4.amplifyapp.com'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'x-api-key'],
            credentials: true, 
        };
        this.app.use(cors(corsOptions));
        this.app.use(express.json());
        this.app.use(validateSecretKey);
    }

    cron() {
        cron.schedule('*/5 * * * *', async () => {
            try {
                await processLogs();
                const now = new Date();
            } catch (error) {
                console.error('Error al ejecutar el proceso de logs:', error);
            }
        });
    }

    routes() {
        this.app.use(this.paths.logs, require('../routes/logs.routes'));
    }

    listen() {
        https.createServer(this.certOptions, this.app).listen(this.port, () => {
            console.log(`Server Corriendo en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;

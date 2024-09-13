const express = require('express')
var cors = require('cors');
const cron = require('node-cron');
const { processLogs } = require('../scripts/script-rabbit-logs');
const date = require('date-and-time');
const { validateSecretKey } = require('../middlewares/auth-middleware');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            logs: '/api/logs',
        }

        this.middlewares();
        this.routes();
        this.cron();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(validateSecretKey);
    }

    cron() {
        cron.schedule('*/1 * * * *', async () => {
            try {
                await processLogs();
                const now = new Date();
                console.log(`${date.format(now, 'YYYY/MM/DD HH:mm:ss')} :: Logs procesados `);
            } catch (error) {
                console.error('Error al ejecutar el proceso de logs:', error);
            }
        });
    }

    routes() {
        this.app.use(this.paths.logs, require('../routes/logs.routes'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server Corriendo en el puerto ${this.port}`)
        })
    }
}

module.exports = Server;
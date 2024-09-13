const { dbConection } = require("../database/config");
const date = require('date-and-time');

const logError = async (error, context) => {
    try {
        const db = await dbConection();
        const errorsCollection = db.collection('ErrorsLogs');
        const errorLog = {
            message: error.message,
            stack: error.stack,
            context,
            timestamp: date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
        };
        await errorsCollection.insertOne(errorLog);
        console.log(`${context} :: Error => ${error.message}`,);
    } catch (dbError) {
        console.error('Error al registrar el error en la base de datos:', dbError);
    }
};

module.exports = {
    logError
};

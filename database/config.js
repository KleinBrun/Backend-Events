require('dotenv').config();
const { MongoClient } = require('mongodb');

let client;

const dbConection = async () => {
    try {
        if (!client) {
            client = new MongoClient(process.env.MONGODB_CNN);
            await client.connect();
        }
        const db = client.db('Registration');
        console.log('Conectado a MongoDB');
        return db;
    } catch (error) {
        console.log('Error al conectar a la DB :: ', error);
        throw error;
    }
}

module.exports = {
    dbConection
}
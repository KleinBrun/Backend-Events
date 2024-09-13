const { MongoClient } = require('mongodb');
require('dotenv').config();

let client;

const dbConection = async () => {
    try {
        if (!client) {
            client = new MongoClient(process.env.MONGODB_CNN);
            await client.connect();
        }
        const db = client.db('Registration');
        return db;
    } catch (error) {
        console.logr('Error al conectar a la DB :: ', error);
        throw error;
    }
}

module.exports = {
    dbConection
}
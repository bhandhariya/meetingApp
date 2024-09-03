const mongoose = require('mongoose');

const server = '127.0.0.1';
const port = '27017';
const databaseName = 'meeting-room-booking';

const URL = `mongodb://${server}:/${databaseName}`;

const dbOptions ={

}

const connectDB = async () => {
    try {
        await mongoose.connect(URL, dbOptions);
        console.log(`MongoDB is connected to ${databaseName} Database on  ${server}  `);
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;

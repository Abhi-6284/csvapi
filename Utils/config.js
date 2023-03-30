require('dotenv').config();
const mongoose = require('mongoose')

const db = 'mongodb://localhost:27017/'+ process.env.DATABASE;

// console.log(db);
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => console.log("Connected to MongoDB"))
            .catch((err) => console.log("Failed to connect to MongoDB"+err));
    } catch {

    }
}

module.exports = connectDB;
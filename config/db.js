import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URL

console.log("Database URL : " + MONGO_URI)

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        console.log("Using cached database connection");
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
            console.log("Database connected");
            return mongoose;
        }).catch((err) => {
            console.log(err);
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

connectDB();

export default mongoose;
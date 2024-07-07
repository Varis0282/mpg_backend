import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URL

console.log("Database URL : " + MONGO_URI)
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Database connected")
    })
    .catch((err) => {
        console.log(err)
    })


export default mongoose;
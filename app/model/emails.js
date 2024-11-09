import mongoose, { Schema } from "mongoose";


const emailSchema = new Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    isRead: { type: Boolean, default: false },
});

const Email = mongoose.model('Email', emailSchema);

export default Email;
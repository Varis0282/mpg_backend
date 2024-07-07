import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
    senderId: { type: String, ref: 'User' },
    receiverId: { type: String, ref: 'User' },
    messageText: { type: String, required: true },
    senderType: { type: String, enum: ["user", "mentor"] },
    receiverType: { type: String, enum: ["user", "mentor"] },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

const DoubtSchema = new Schema({
    userId: { type: String, ref: 'User', required: true },
    courseId: { type: String, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    messages: [MessageSchema],
    status: { type: String, default: "pending", enum: ["pending", "resolved", "rejected"] },
    resolvedAt: { type: Date },
    resolvedBy: { type: String, ref: 'User' },
    resolveText: { type: String },
    lastMessageAt: { type: Date, default: Date.now }
}, { timestamps: true });


// create a plugin for updating lastMessageAt field only when a message is added using isModified method
DoubtSchema.plugin(function (schema) {
    schema.pre('save', function (next) {
        if (this.isModified('messages')) {
            this.lastMessageAt = Date.now();
        }
        next();
    });
});


// create a function to mark doubt as resolved
DoubtSchema.methods.resolve = async function (data) {
    try {
        this.status = "resolved";
        this.resolvedAt = Date.now();
        this.resolvedBy = data?.userId;
        this.resolveText = data?.resolveText;
        return await this.save();
    } catch (error) {
        throw error;
    }
}


const Doubt = mongoose.model('Doubt', DoubtSchema);

export default Doubt;
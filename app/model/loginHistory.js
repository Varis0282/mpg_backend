import mongoose, { Schema } from "mongoose";

const loginHistorySchema = new Schema(
    {
        userId: { type: String, ref: 'User' },
        deviceId: { type: String, default: null },
        deviceName: { type: String, default: null },
        deviceModel: { type: String, default: null },
        deviceOs: { type: String, default: null },
    },
    { timestamps: true }
);


const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);
export default LoginHistory;
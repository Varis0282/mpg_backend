import mongoose, { Schema } from "mongoose";

const batchSchema = new Schema(
    {
        name: { type: String, required: true, unique: true},
        startDate: { type: Date, required: true },
        enrollActiveTill: { type: Date, required: true },
        enrollActive: { type: Boolean, required: true },
        duration: { type: Number, required: true },//in weeks
        classTiming: [{
            day: { type: String, required: true },
            time: { type: String, required: true },
        }],
        course: { type: String, ref: "Course" },
        users: [{ type: String, ref: "User" }],
    },
    { timestamps: true }
)

const Batch = mongoose.model("Batch", batchSchema);

export default Batch;
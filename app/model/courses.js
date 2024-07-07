import mongoose, { Schema } from "mongoose";


const skillSchema = new Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        link: { type: String, required: true },
    },
    { timestamps: true }
);

const moduleSchema = new Schema(
    {
        name: { type: String, required: true },
        numberOfTopics: { type: Number, required: true },
        topics: [String],
    },
    { timestamps: true }
)

const mentorSchema = new Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        linkendin: { type: String, required: true },
        github: { type: String, required: true },
        description: { type: String, required: true },
        companyImage: { type: String, required: true },
    },
    { timestamps: true }
)

const projectSchema = new Schema(
    {
        name: { type: String, required: true },
        image: String,
        description: { type: String, required: true },
        link: String,
    },
    { timestamps: true }
)

const keyFeaturesSchema = new Schema(
    {
        name: { type: String, required: true },
        image: String,
        description: { type: String, required: true },
    },
    { timestamps: true }
)

const metaSchema = new Schema(
    {
        image: { type: String, required: true },
        data: { type: String, required: true },
    },
    { timestamps: true }
)

const reviewSchema = new Schema(
    {
        userId: { type: String, ref: 'User' },
        userName: { type: String, required: true },
        rating: { type: Number, required: true },
        review: { type: String, required: true },
    },
    { timestamps: true }
)

const courseSchema = new Schema(
    {
        name: { type: String, required: true },
        headline: { type: String, required: true },
        description: { type: String, required: true },
        skills: [skillSchema],
        modules: [moduleSchema],
        mentors: [mentorSchema],
        projects: [projectSchema],
        keyFeatures: [keyFeaturesSchema],
        meta: [metaSchema],
        reviews: [reviewSchema],
        durationInWeeks: { type: Number, required: true }, // in weeks
        usersEnrolled: [{ type: String, ref: 'User' }],
        upComingBatches: [{ type: String, ref: 'Batch' }],
    },
    { timestamps: true }
)

const Course = mongoose.model('Course', courseSchema);

export default Course;
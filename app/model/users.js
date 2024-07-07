import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

const academySchema = new Schema({
    college: String,
    branch: String,
    city: String,
    course: String,
    passoutYear: Number,
    semester: Number
});

const verifySchema = new Schema({
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false }
})

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true, unique: true },
        phone: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        role: { type: String, default: "user", enum: ["user", "admin", "mentor"] },
        status: { type: String, default: "active", enum: ["active", "inactive"], index: true },
        verify: verifySchema,
        lastOTP: String,
        lastOTPTime: Date,
        lastLogin: Date,
        academicDetails: academySchema,
        profilePic: String,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    },
    { timestamps: true }
);

// Hash the user's password before saving.
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        return next();
    }
});

userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = resetToken;

    this.resetPasswordExpires = Date.now() + 900000; // 15 minutes

    return this.save().then(() => resetToken);
};

// Method to compare password for login.
userSchema.methods.validPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateToken = async function (expiresIn = '7d') {
    const token = jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.JWT_SECRET,
        { expiresIn: expiresIn }
    );
    return token;
};

const User = mongoose.model('User', userSchema);

export default User;
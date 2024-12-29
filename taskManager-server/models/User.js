import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    job: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        default: 'none',
        trim: true
    },
    languages: {
        type: String,
        default: 'none',
        trim: true
    },
    joinedDate: {
        type: Date,
        default: Date.now,
    },
    location: {
        type: String,
        trim: true,
        default: 'Casablanca, Morocco',
    },
    about: {
        type: String,
        default: 'No description provided',
        trim: true
    },
    profileImage: {
        type: String,
        default: null
    },
    bannerImage: {
        type: String,
        default: null
    },
    skills: {
        type: [String],
        default: []
    }
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); 
    next();
});

export default mongoose.model('User', UserSchema);

const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true }, 
    password: { type: String, required: true, minlength: 6 }, 
    interests: {
        type: [String],  
        enum: [
            "AI/ML",
            "Web Development",
            "Data Science",
            "IoT (Internet of Things)",
            "Virtual Reality / Augmented Reality",
            "Game Development",
            "UI/UX Design",
            "Cloud",
            "Cybersecurity",
            "Blockchain",
            "Robotics",
            "DevOps",
            "Quantum Computing",
            "Big Data",
            "Hackathon",
            "Competitive Coding",
        ],
        default: []
    },
    createdAt: { type: Date, default: Date.now } });

module.exports = mongoose.model('User', User);
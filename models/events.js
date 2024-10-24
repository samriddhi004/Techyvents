const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },    
    location: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    eventType: {
        type: String,
        enum: ['online', 'offline'],  // Online or offline event
        required: true
    },
    category: {
        type: String,
        enum: ['AI/ML', 'Cloud', 'Web Development', 'Mobile Development', 'Blockchain', 'Cybersecurity', 'Data Science'],
        required: true
    },
    registrationLink: {
        type: String  // If registration is required
    },
    duration: {
        type: Number,  // Duration in hours
        required: true
    },
    organizer: {
        type: String,  // Event organizer's name or details
        required: true
    },
    keywords: [String],  // Tags or keywords for the event (e.g., ['AI', 'Web Development'])
    pricing: {
        type: String,
        enum: ['free', 'paid'],
        required: true
    },
    ticketPrice: {
        type: Number,  // Only required if the event is 'paid'
        required: function() { return this.pricing === 'paid'; }
    },
    speakers: [{
        name: String,
        title: String,
        bio: String
    }],
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;

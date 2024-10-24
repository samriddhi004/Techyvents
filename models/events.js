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
    category: {
        type: String,
        enum: ['AI/ML', 'Cloud', 'Web Development', 'Mobile Development', 'Blockchain', 'Cybersecurity', 'Data Science'],
        required: true
    },
    startdateTime: {
        type: Date,
        required: true
    },    
    enddateTime: {
        type: Date,
        required: true
    },  
    address: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    eventMode: {
        type: String,
        enum: ['online', 'on-site'],  // Online or offline event
        required: true
    },
    pricing: {
        type: String,
        enum: ['free', 'paid'],
        required: true
    },
    ticketPrice: {
        type: Number,  // Only required if the event is 'paid'
        required: function() { return this.pricing === 'paid'; }
    },
    registrationLink: {
        type: String  // If registration is required
    },
    // duration: {
    //     type: Number,  // Duration in hours
    //     required: true
    // },
    organizer: {
        type: String,  // Event organizer's name or details
        required: true
    },
    keywords: [String],  // Tags or keywords for the event (e.g., ['AI', 'Web Development'])
    
    // speakers: [{
    //     name: String,
    //     title: String,
    //     bio: String
    // }],
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;

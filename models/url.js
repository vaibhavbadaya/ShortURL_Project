const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    redirectUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    visitedHistory: [{
        timestamp: { type: Date, default: Date.now }
    }],
},
    { timestamps: true }
);


const URL = mongoose.model('URL',urlSchema)

module.exports = { 
    URL,
};
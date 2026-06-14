const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    atsScore: {
        type: Number,
        required: true
    },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    suggestions: [{ type: String }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
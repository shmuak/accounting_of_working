const mongoose = require('mongoose');

const WorkshopSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, trim: true }
}, {timestamps: true});

module.exports = mongoose.model('Workshop', WorkshopSchema);
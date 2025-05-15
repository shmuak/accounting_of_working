const mongoose = require('mongoose');

const ConsumableSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    quantity: { type: String, required: true },
    category: { type: String, required: true},
    unit: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Consumable', ConsumableSchema);
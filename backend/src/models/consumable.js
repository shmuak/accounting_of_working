const mongoose = require('mongoose');

const ConsumableSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
    workshopId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Workshop', 
        required: true 
    },
}, { timestamps: true });

module.exports = mongoose.model('Consumable', ConsumableSchema);
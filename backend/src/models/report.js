const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    masterId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    workDescription: { type: String, required: true, trim: true },
    usedConsumables: [{
        consumableId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Consumable', 
            required: true 
        },
        quantity: { type: Number, required: true, min: 1 }
    }],
    workshopId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Workshop', 
        required: true 
    },
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
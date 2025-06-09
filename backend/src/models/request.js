const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
    masterId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    title: {type: String, required: true, trim: true},
    description:{ type:String, trim: true },
    status: { type:String, required: true, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true })

module.exports = mongoose.model('Request', RequestSchema);
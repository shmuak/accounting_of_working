const mongoose = require('mongoose');

const ComplitedRequestsSchema = new mongoose.Schema({
    equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
    masterId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    ajusterId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    title: {type: String, required: true, trim: true},
    description:{ type:String, trim: true },
}, { timestamps: true })

module.exports = mongoose.model('ComplitedRequests', ComplitedRequestsSchema);
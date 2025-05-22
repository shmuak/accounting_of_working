const mongoose = require('mongoose');

const RequestsAjasterSchema = new mongoose.Schema({
    equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
    masterId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    workshopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop', required: true },
    masterScheduleId: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true, trim: true},
    description:{ type:String, trim: true },
}, { timestamps: true })

module.exports = mongoose.model('RequestsAjaster', RequestsAjasterSchema);
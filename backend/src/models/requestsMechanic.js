const mongoose = require('mongoose');

const RequestsMechanicSchema = new mongoose.Schema({
    equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
    masterId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
   masterScheduleId: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true, trim: true},
    description:{ type:String, trim: true },
    status: { type:String, required: true, enum: ['Pending', 'Approved', 'Rejected','Completed'], default: 'Pending' }
}, { timestamps: true })

module.exports = mongoose.model('RequestMechanic', RequestsMechanicSchema);
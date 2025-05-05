const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    type: {type: String, required: true, trim: true},
    description: { type: String, trim: true },
    status: {type: String, required: true, enum: ['working', 'under_maintenance', 'broken'], default: 'working'},
    // lastMaintenanceDate: { type: Date },
    // nextMaintenanceDate: {type: Date},
    workshopId:{type:mongoose.Schema.Types.ObjectId, ref:'Workshop', required: true},
},{timestamps: true});

module.exports = mongoose.model('Equipment', EquipmentSchema);
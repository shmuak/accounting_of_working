const mongoose = require('mongoose');

const MaintenanceScheduleSchema = new mongoose.Schema({
    masterId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    equipmentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Equipment', 
        required: true 
    },
    scheduledDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'In Progress', 'Completed'], 
        default: 'Pending' 
    },
    notes: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceSchedule', MaintenanceScheduleSchema);
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: {type: String, unique:true, required: true},
    password: {type: String, required: true},
    role: {type: String, ref: 'Role'},
    // { type: String, required: true, enum: ['Master', 'Admin', 'Dispetcher','Storekeeper','Mechanic','Adjuster'] },
    workshopId: { type: mongoose.Schema.Types.ObjectId, trim: true },
    equipmentId: {type: mongoose.Schema.Types.ObjectId, trim: true, }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

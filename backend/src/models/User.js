const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: {type: String, required: true},
    name: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true }, 
    role: { type: String, required: true, enum: ['Worker', 'Master', 'Admin'] },
    phone: { type: String, required: true, trim: true },
    workshopId: { type: mongoose.Schema.Types.ObjectId, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

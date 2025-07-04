const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, ref: 'Role' },
    workshop: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' },
  }, { timestamps: true });
  

module.exports = mongoose.model('User', UserSchema);

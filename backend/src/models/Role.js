const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    value: {type: String, required: true}
})

module.exports = mongoose.model('Role', RoleSchema);        
const User = require("../models/User");

class adminController {
    async getUsers(req, res) {
        try {
            const users = await User.find().populate('workshop');
            res.json(users);            
        } catch(e) {
            console.log(e);
            res.status(500).json({message: "Server error"});
        }
    }    
}

module.exports = new adminController();
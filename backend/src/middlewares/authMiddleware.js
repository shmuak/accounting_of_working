const jwt = require("jsonwebtoken");

module.exports = (req,res, next) => {
    if(req.method === "OPTIONS") {
        return next();
    }

    try {
        const token = req.headers.authorization.split(" ")[1];
        if(!token) {
            return res.status(403).json({message:"Пользователь не авторизирован"});
        }
        const decodedData = jwt.verify(token, process.env.secret_key)
        req.user = decodedData;
        next();
    } catch(e) {
        console.log(e);
        return res.status(403).json({message:"Пользователь не авторизирован"});

    }
}
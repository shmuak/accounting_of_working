const jwt = require("jsonwebtoken");

module.exports = function(requiredRole) {
    return function(req, res, next) {
        if (req.method === "OPTIONS") {
            return next(); 
        }

        try {
            const token = req.headers.authorization.split(" ")[1]; 
            if (!token) {
                return res.status(403).json({ message: "Пользователь не авторизован" });
            }

            const decoded = jwt.verify(token, process.env.secret_key);

            if (decoded.role !== requiredRole) {
                return res.status(403).json({ message: "У вас нет доступа" });
            }

            req.user = decoded;
            next();
        } catch (e) {
            console.log(e);
            return res.status(403).json({ message: "Пользователь не авторизован" });
        }
    };
};
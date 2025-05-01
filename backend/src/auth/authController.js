const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");

const generateAccessToken = (id, role) => {
    const payload =  {
        id,
        role
    } 
    return jwt.sign(payload, process.env.secret_key, {expiresIn: "24h"})
}
class authController {
    async registration(req, res) {
        try {
          const errors = validationResult(req)
          if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Ошибка при регистрации", errors })
          }
      
          const { login, password, role, workshop } = req.body
      
          const candidate = await User.findOne({ login })
          if (candidate) {
            return res.status(400).json({ message: "Пользователь уже существует" })
          }
      
          const hash = bcrypt.hashSync(password, 7)
      
          const user = new User({
            login,
            password: hash,
            role,
            workshop
          })
      
          console.log('Создаю пользователя:', user)
      
          await user.save()
      
          return res.status(201).json({ message: "Пользователь зарегистрирован", user })
      
        } catch (e) {
          console.error('Ошибка при регистрации:', e)
          return res.status(500).json({ message: "Ошибка сервера" })
        }
      }      
    

    async login(req,res) {
        try {
            const {login, password} = req.body;
            const user = await User.findOne({login});
            if(!user) {
                return res.status(400).json({message:"Неверный логин"});
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if(!validPassword) {
                return res.status(400).json({message:"Неверный пароль"});                
            }
            const token = generateAccessToken(user._id, user.role)
            return res.json({token})
        } catch(e) {
            console.log(e);
            res.status(500).json({message: "Server error"});
        }
    }
}

module.exports = new authController();
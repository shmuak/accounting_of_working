const User = require('../models/User');

// Получить всех пользователей
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ message: 'Get all users', users });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Создать пользователя
const createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User added', user: savedUser });
    } catch (error) {
        if (error.code === 11000) { // Ошибка дублирования (если name уникальный)
            return res.status(400).json({ message: 'User with this name already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Обновить пользователя
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Удалить пользователя
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: `User ${user.name} deleted` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };

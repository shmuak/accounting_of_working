const express = require('express');
const Role = require('../models/Role');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении ролей' });
  }
});

module.exports = router;

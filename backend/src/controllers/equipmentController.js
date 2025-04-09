const Equipment = require('../models/equipment');

//Получение всего оборудования
const getEquipments = async (req,res) => {
    try {
        const equipment = await Equipment.find();
        res.status(200).json({message:'Get all Equipment', equipment});
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
} 

//Создание оборудования
const createEquipment = async (req, res) => {
      try {
           const newEquipment = new Equipment(req.body);
           const savedEquipment = await newEquipment.save();
           res.status(201).json({ message: 'User added', equipment: savedEquipment });
       } catch (error) {
           if (error.code === 11000) { // Ошибка дублирования (если name уникальный)
               return res.status(400).json({ message: 'Equipment with this name already exists' });
           }
           res.status(500).json({ message: 'Server error' });
       }
}

//обновление данных оборудования
const updateEquipment = async (req,res) => {
    try {
        const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!equipment) return res.status(404).json({message:'equipment not found'})
        res.status(201).json({message:'equipment updated', equipment})
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
}

//удаление оборудования
const deleteEquipment = async (req,res) => {
    try {
        const equipment = await Equipment.findByIdAndDelete(req.params.id);
        if(!equipment) return res.status(404).json({message:'equipment not found'})
        res.status(200).json({message:`Equipment ${equipment.name} deleted`})
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
}

module.exports = { getEquipments, createEquipment, updateEquipment, deleteEquipment }
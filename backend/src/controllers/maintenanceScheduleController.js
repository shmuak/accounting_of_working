const MaintenanceSchedule = require('../models/maintenanceSchedule');

//Получение всех графиков
const getMaintenanceSchedules = async (req,res) => {
    try {
        const maintenanceSchedule = await MaintenanceSchedule.find();
        res.status(200).json({message:'Get all Maintenance Schedule', maintenanceSchedule});
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
} 

//Создание графика
const createMaintenanceSchedule = async (req, res) => {
      try {
           const newMaintenanceSchedule = new MaintenanceSchedule(req.body);
           const savedMaintenanceSchedule = await newMaintenanceSchedule.save();
           res.status(201).json({ message: 'Maintenance Schedule added', equipment: savedMaintenanceSchedule });
       } catch (error) {
           if (error.code === 11000) { // Ошибка дублирования (если name уникальный)
               return res.status(400).json({ message: 'Maintenance Schedule with this name already exists' });
           }
           res.status(500).json({ message: 'Server error' });
       }
}

//обновление данных графика
const updateMaintenanceSchedule = async (req,res) => {
    try {
        const maintenanceSchedule = await MaintenanceSchedule.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!maintenanceSchedule) return res.status(404).json({message:'Maintenance Schedule not found'})
        res.status(201).json({message:'Maintenance Schedule updated', maintenanceSchedule})
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
}

//удаление графика
const deleteMaintenanceSchedule = async (req,res) => {
    try {
        const maintenanceSchedule = await MaintenanceSchedule.findByIdAndDelete(req.params.id);
        if(!maintenanceSchedule) return res.status(404).json({message:'Maintenance Schedule not found'})
        res.status(200).json({message:`Maintenance Schedule ${req.params.id} deleted`})
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
}

module.exports = { getMaintenanceSchedules, createMaintenanceSchedule, updateMaintenanceSchedule, deleteMaintenanceSchedule }
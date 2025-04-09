const Report = require('../models/report');

//Получение всех отчетов
const getReports = async (req,res) => {
    try {
        const report = await Report.find();
        res.status(200).json({message:'Get all reports', report});
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
} 

//Создание отчета
const createReport = async (req, res) => {
      try {
           const newReport = new Report(req.body);
           const savedReport = await newReport.save();
           res.status(201).json({ message: 'Report added', equipment: savedReport });
       } catch (error) {
           if (error.code === 11000) { // Ошибка дублирования (если name уникальный)
               return res.status(400).json({ message: 'Report with this name already exists' });
           }
           res.status(500).json({ message: 'Server error' });
       }
}

//обновление данных отчета
const updateReport = async (req,res) => {
    try {
        const report = await Report.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!report) return res.status(404).json({message:'Report not found'})
        res.status(201).json({message:'Report updated', report})
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
}

//удаление графика
const deleteReport = async (req,res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if(!report) return res.status(404).json({message:'Report not found'})
        res.status(200).json({message:`Report ${req.params.id} deleted`})
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
}

module.exports = { getReports, createReport, updateReport, deleteReport }
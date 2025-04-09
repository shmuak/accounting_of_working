const Workshop = require('../models/workshop');

//получение всех цехов
const getWorkshops = async (req,res) => {
    try {
        const Workshops = await Workshop.find();
        res.status(200).json({message:'Gel all workshops', Workshops});
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
}

//добавлкение цеха 
const createWorkshop = async (req,res) => {
    try {
        const newWorkshop = new Workshop(req.body);
        const saveWorkshop = await newWorkshop.save(); 
        res.status(201).json({message:`Workshop ${saveWorkshop.name} added`, workshop:saveWorkshop});
    } catch (error) {
        if (error.code === 11000) { // Ошибка дублирования (если name уникальный)
            return res.status(400).json({ message: 'Workshop with this name already exists' });
        }
        res.status(500).json({message:'Server error'});
    }
}

//изменение цеха
const updateWorkshop = async (req,res) => {
    try {   
        const workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!workshop) return res.status(404).json({message:'Workshop not found'});
        res.status(200).json({message:`Workshop ${workshop.name} updated`, workshop});
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
}

//удаление цеха
const deleteWorkshop = async (req,res) => {
    try {
        const workshop = await Workshop.findByIdAndDelete(req.params.id)
        if(!workshop) return res.status(404).json({message:'Workshop not found'});
        res.status(200).json({message:`Workshop ${workshop.name} deleted`});
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
}

module.exports = { getWorkshops, createWorkshop, updateWorkshop, deleteWorkshop };
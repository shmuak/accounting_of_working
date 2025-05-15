const Consumable = require('../models/consumable');

//Получение всех расходников
const getConsumables = async (req,res) => {
    try {
        const consumable = await Consumable.find();
        res.status(200).json({message:'Get all Consumables', consumable});
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
} 

//Создание расходника
const createConsumable = async (req, res) => {
  try {
    const { name, quantity, unit, category } = req.body;
    console.log('Received data:', { name, quantity, unit, category }); 
    
    const newConsumable = new Consumable({
      name,
      quantity,
      unit,
      category 
    });
    
    const savedConsumable = await newConsumable.save();
    res.status(201).json(savedConsumable);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

//обновление данных расходника
const updateConsumable = async (req,res) => {
    try {
        const consumable = await Consumable.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!consumable) return res.status(404).json({message:'consumable not found'})
        res.status(201).json({message:'consumable updated', consumable})
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
}

//удаление расходника
const deleteConsumable = async (req,res) => {
    try {
        const consumable = await Consumable.findByIdAndDelete(req.params.id);
        if(!consumable) return res.status(404).json({message:'Consumable not found'})
        res.status(200).json({message:`Consumable ${consumable.name} deleted`})
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
}

module.exports = { getConsumables, createConsumable, updateConsumable, deleteConsumable };
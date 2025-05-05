const Request = require('../models/request');

//получение всех заявок 
const getRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        res.status(200).json({message:'Get all requests',requests})
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}

//создание заявки
const createRequest = async (req,res) => {
    try {
      const { title, description, status, equipmentId, masterId } = req.body;
      
      const newRequest = new Request({
        title,
        description,
        status: status || 'Pending',
        equipmentId,
        masterId
      });
      
      const savedRequest = await newRequest.save();
      res.status(200).json({ 
        message: 'Request added', 
        request: savedRequest 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({message:'Server error'});
    }
  }
//изменение заявки
const updateRequest = async (req,res) => {
    try {
        const request = await Request.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!request) return res.status(404).json({message:'request not found'})
        res.status(201).json({message:'Request updated', request})
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
}

const deleteRequest = async (req,res) => {
    try {
        const request = await Request.findByIdAndDelete(req.params.id);
        if(!request) return res.status(404).json({message:'request not found'})
        res.status(200).json({message:`Request ${req.params.id} deleted`})
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
}

module.exports = { getRequests, createRequest, updateRequest, deleteRequest }
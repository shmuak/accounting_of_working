const RequestsAjaster = require('../models/requestsAjaster');

const getRequestsAjaster = async (req, res) => {
  try {
    const requests = await RequestsAjaster.find()
      .populate('masterId')
      .populate('workshopId') // Добавляем populate для workshopId
      .populate({
        path: 'equipmentId',
        populate: { path: 'workshopId' }
      });
    console.log(requests)
    res.status(200).json({ message: 'Get all requests', requests });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createAjasterRequest = async (req, res) => {
  try {
    const { title, description, equipmentId, masterId, workshopId, usedConsumables } = req.body;

    const newRequest = new RequestsAjaster({
      title,
      description,
      equipmentId,
      masterId,
      workshopId, // Добавляем workshopId
      usedConsumables,
      status: 'Pending'
    });

    const savedRequest = await newRequest.save();
    res.status(201).json({ 
      message: 'Ajaster request created', 
      request: savedRequest 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRequestsAjaster = async (req, res) => {
  try {
    const updates = req.body;
    const request = await RequestsAjaster.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('masterId');
    
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    res.status(200).json({
      message: 'Request updated',
      request
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteRequestsAjaster = async (req, res) => {
  try {
    const request = await RequestsAjaster.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.status(200).json({ message: `Request ${req.params.id} deleted` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  getRequestsAjaster, 
  createAjasterRequest, 
  updateRequestsAjaster, 
  deleteRequestsAjaster 
};
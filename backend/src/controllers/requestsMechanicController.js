const RequestMechanic = require('../models/requestsMechanic');

const getRequestsMechanic = async (req, res) => {
    try {
      const requests = await RequestMechanic.find()
        .populate('masterId') 
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

const createRequestsMechanic = async (req, res) => {
  try {
    const { title, description, status, equipmentId, masterId } = req.body;
    
    const newRequest = new RequestMechanic({
      title,
      description,
      status: status || 'Pending',
      equipmentId,
      masterId
    });
    
    const savedRequest = await newRequest.save();
    res.status(201).json({ 
      message: 'Request added', 
      request: savedRequest 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRequestsMechanic = async (req, res) => {
  try {
    const updates = req.body;
    const request = await RequestMechanic.findByIdAndUpdate(
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

const deleteRequestsMechanic = async (req, res) => {
  try {
    const request = await RequestMechanic.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.status(200).json({ message: `Request ${req.params.id} deleted` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  getRequestsMechanic, 
  createRequestsMechanic, 
  updateRequestsMechanic, 
  deleteRequestsMechanic 
};
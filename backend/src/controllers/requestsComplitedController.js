const ComplitedRequests = require('../models/complitdRequests');

const getComplitedRequests = async (req, res) => {
    try {
        const requests = await ComplitedRequests.find()
            .populate('masterId')
            .populate('ajusterId')
            .populate({
                path: 'equipmentId',
                populate: { path: 'workshopId' }
            });
        
        res.status(200).json({ 
            message: 'Get all completed requests', 
            requests 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createComplitedRequest = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            equipmentId, 
            masterId, 
            ajusterId,
            // Можно добавить дополнительные поля из оригинальной заявки
            originalRequestId 
        } = req.body;
        
        const newRequest = new ComplitedRequests({
            title,
            description,
            equipmentId,
            masterId,
            ajusterId,
            originalRequestId,
            completedAt: new Date()
        });
        
        const savedRequest = await newRequest.save();
        
        res.status(201).json({ 
            message: 'Completed request created', 
            request: savedRequest 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateComplitedRequest = async (req, res) => {
    try {
        const updates = req.body;
        const request = await ComplitedRequests.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        )
        .populate('masterId')
        .populate('ajusterId');
        
        if (!request) {
            return res.status(404).json({ message: 'Completed request not found' });
        }
        
        res.status(200).json({
            message: 'Completed request updated',
            request
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteComplitedRequest = async (req, res) => {
    try {
        const request = await ComplitedRequests.findByIdAndDelete(req.params.id);
        
        if (!request) {
            return res.status(404).json({ message: 'Completed request not found' });
        }
        
        res.status(200).json({ 
            message: `Completed request ${req.params.id} deleted` 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getComplitedRequestById = async (req, res) => {
    try {
        const request = await ComplitedRequests.findById(req.params.id)
            .populate('masterId')
            .populate('ajusterId')
            .populate({
                path: 'equipmentId',
                populate: { path: 'workshopId' }
            });
        
        if (!request) {
            return res.status(404).json({ message: 'Completed request not found' });
        }
        
        res.status(200).json({
            message: 'Completed request found',
            request
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { 
    getComplitedRequests,
    createComplitedRequest,
    updateComplitedRequest,
    deleteComplitedRequest,
    getComplitedRequestById
};
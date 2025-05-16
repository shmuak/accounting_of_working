const RequestsStokekeeper = require('../models/requestsStokekeeper');
const Consumable = require('../models/consumable');
const User = require('../models/User'); // Убедитесь, что путь к модели User верный

const getRequestsStokekeeper = async (req, res) => {
    try {
      // Добавляем популяцию masterId и consumableId
      const requests = await RequestsStokekeeper.find()
        .populate('masterId', 'login') // Популяризируем masterId, берем только login
        .populate('consumableId'); // Популяризируем consumableId
      res.status(200).json({ message: 'Get all requests', requests });
    } catch (error) {
      console.error('Error in getRequestsStokekeeper:', error); // Добавьте логирование ошибок
      res.status(500).json({ message: 'Server error' });
    }
};

const createRequestsStokekeeper = async (req, res) => {
  try {
    const { quantity, masterId, consumableId } = req.body;

    const consumable = await Consumable.findById(consumableId);
    if (!consumable) {
      return res.status(404).json({ message: 'Consumable not found' });
    }

    const newRequest = new RequestsStokekeeper({
      name: consumable.name,
      quantity,
      category: consumable.category,
      unit: consumable.unit,
      masterId,
      consumableId, // Сохраняем ссылку на расходник
      status: 'В обработке' // Устанавливаем начальный статус
    });

    const savedRequest = await newRequest.save();

    // Популяризируем для ответа
     const populatedRequest = await RequestsStokekeeper.findById(savedRequest._id)
        .populate('masterId', 'login')
        .populate('consumableId')
        .lean();


    res.status(201).json({
      message: 'Request added',
      request: populatedRequest // Отправляем популяризированный объект
    });
  } catch (error) {
    console.error('Error in createRequestsStokekeeper:', error);
    // Проверяем, является ли ошибка валидационной
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// НОВАЯ функция для создания заявки вручную (без привязки к существующему consumable)
const createManualConsumableRequest = async (req, res) => {
  try {
    // Принимаем данные из тела запроса
    const { name, quantity, unit, category, masterId } = req.body;

    // Простая валидация (можно добавить более строгую)
    if (!name || !quantity || !unit || !category || !masterId) {
        return res.status(400).json({ message: 'Missing required fields: name, quantity, unit, category, masterId' });
    }

    // Проверка существования мастера (опционально, но рекомендуется)
    const masterExists = await User.findById(masterId);
    if (!masterExists) {
        return res.status(404).json({ message: 'Master user not found' });
    }

    // Создаем новую заявку. consumablesId не указываем.
    const newRequest = new RequestsStokekeeper({
      name,
      quantity,
      category,
      unit,
      masterId,
      // consumableId здесь не указывается
      status: 'В обработке' // Устанавливаем начальный статус
    });

    const savedRequest = await newRequest.save();

    // Популяризируем для ответа
    const populatedRequest = await RequestsStokekeeper.findById(savedRequest._id)
        .populate('masterId', 'login') // Популяризируем masterId
        // consumableId не популяризируем, так как его нет
        .lean();

    res.status(201).json({
      message: 'Manual request added',
      request: populatedRequest // Отправляем популяризированный объект
    });
  } catch (error) {
    console.error('Error in createManualConsumableRequest:', error);
    // Проверяем, является ли ошибка валидационной
    if (error.name === 'ValidationError') {
        // Mongoose ValidationError может содержать детали
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Server error during manual request creation' });
  }
};


const getRequestsStokekeeperByMaster = async (req, res) => {
  try {
    const { masterId, status } = req.query; // Можем получать статус для фильтрации

    if (!masterId) {
         return res.status(400).json({ message: 'masterId query parameter is required' });
    }

    const query = { masterId };

    if (status && status !== 'all') { // Если статус указан и не 'all'
        query.status = status;
    }

    const requests = await RequestsStokekeeper.find(query) // Используем объект query
      .populate('consumableId') // Популяризируем расходник
      .populate('masterId', 'login') // Популяризируем мастера, берем только login
      .sort({ createdAt: -1 }); // Сортируем по дате создания

    res.status(200).json({
      message: 'Requests found',
      requests
    });
  } catch (error) {
    console.error('Error in getRequestsStokekeeperByMaster:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Обратите внимание: updateRequestsStokekeeper и deleteRequestsStokekeeper
// должны учитывать новое поле status и, возможно, consumableId=null
// Пример для update:
const updateRequestsStokekeeper = async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;
    
    // Упрощенная версия без проверки переходов
    const updatedRequest = await RequestsStokekeeper.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    res.status(200).json({
      message: 'Request status updated',
      request: updatedRequest
    });
  } catch (error) {
    console.error('Error in updateRequestsStokekeeper:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message
    });
  }
};
const deleteRequestsStokekeeper = async (req, res) => {
  try {
    const request = await RequestsStokekeeper.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    // Опционально: добавить проверку статуса перед удалением (например, нельзя удалить принятую/прибывшую)
    res.status(200).json({ message: `Request ${req.params.id} deleted` });
  } catch (error) {
     console.error('Error in deleteRequestsStokekeeper:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {
  getRequestsStokekeeper,
  createRequestsStokekeeper,
  updateRequestsStokekeeper,
  deleteRequestsStokekeeper,
  getRequestsStokekeeperByMaster,
  createManualConsumableRequest // Экспортируем новую функцию
};
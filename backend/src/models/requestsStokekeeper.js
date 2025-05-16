const mongoose = require('mongoose');

const RequestsStokekeeperSchema = new mongoose.Schema({
    masterId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
      consumableId: {
        type: mongoose.Types.ObjectId,
        ref: 'Consumable' },
     name: { type: String, required: true, trim: true },
    quantity: { type: String, required: true },
    category: { type: String, required: true},
      status: { // НОВОЕ ПОЛЕ
        type: String,
        required: true,
        enum: ['В обработке', 'Принято', 'Прибыло','Выполнено ', 'Отменено'], // Добавьте возможные статусы
        default: 'В обработке' // Начальный статус по умолчанию
    },
    unit: { type: String, required: true, trim: true }
}, { timestamps: true })

module.exports = mongoose.model('RequestsStokekeeper', RequestsStokekeeperSchema);
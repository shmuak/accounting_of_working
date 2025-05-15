import { useState } from 'react';
import styles from '../../../../shared/styles/pages/storekeeper/inventory.module.scss';
import { IConsumable } from '../../../../shared/types/index';

interface CreateConsumableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (consumable: Omit<IConsumable, '_id'>) => void;
}

const CreateConsumableModal = ({ isOpen, onClose, onSubmit }: CreateConsumableModalProps) => {
  const categories = ['Запчасти', 'Инструменты', 'Расходники', 'Электроника', 'Прочее'];
  
  const [formData, setFormData] = useState<Omit<IConsumable, '_id'>>({
    name: '',
    quantity: "0",
    unit: 'шт',
    category: 'Расходники'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Добавить новый расходник</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Наименование:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Количество:</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Единица измерения:</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
            >
              <option value="шт">шт</option>
              <option value="кг">кг</option>
              <option value="л">л</option>
              <option value="м">м</option>
              <option value="упак">упак</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Категория:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.modalButtons}>
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateConsumableModal;
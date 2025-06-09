import { useState, useEffect } from 'react';
import styles from '../../../shared/styles/pages/storekeeper/inventory.module.scss';
import { Category, Categories } from '../../../shared/types'; 

interface FormData {
  name: string;
  quantity: string;
  unit: string;
  category: Category | '';
}

interface CreateManualRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>; 
  isLoading: boolean;
  error: string | null;
}

const CreateManualRequestModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error
}: CreateManualRequestModalProps) => {

  // Используем Object.values для получения массива значений категорий
  const categoryOptions = Object.values(Categories);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    quantity: '1', // Начальное количество по умолчанию 1
    unit: 'шт',
    category: categoryOptions.length > 0 ? categoryOptions[0] : '', // Устанавливаем первую категорию по умолчанию
  });

  // Сбрасываем форму при открытии модального окна
  useEffect(() => {
      if (isOpen) {
          setFormData({
              name: '',
              quantity: '1',
              unit: 'шт',
              category: categoryOptions.length > 0 ? categoryOptions[0] : '',
          });
      }
  }, [isOpen]); // Сбрасываем при изменении isOpen

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
     if (name === 'quantity') {
         // Простая валидация: только цифры, не отрицательные
        if (/^\d*$/.test(value)) {
             setFormData(prev => ({ ...prev, [name]: value }));
         }
     } else {
         setFormData(prev => ({ ...prev, [name]: value }));
     }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Дополнительная проверка перед отправкой
    if (!formData.name || parseInt(formData.quantity) <= 0 || !formData.unit || !formData.category) {
        alert('Пожалуйста, заполните все поля и укажите количество больше 0.');
        return;
    }
    // Вызываем переданный onSubmit из родителя
    await onSubmit(formData);
    // Родительский компонент закроет модальное окно и обновит данные
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Создать заявку</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="manual-name">Наименование:</label>
            <input
              id="manual-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading} // Отключаем ввод во время загрузки
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="manual-quantity">Количество:</label>
            <input
              id="manual-quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="manual-unit">Единица измерения:</label>
            <select
              id="manual-unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              <option value="шт">шт</option>
              <option value="кг">кг</option>
              <option value="л">л</option>
              <option value="м">м</option>
              <option value="упак">упак</option>
              {/* Можете добавить другие единицы измерения */}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="manual-category">Категория:</label>
            <select
              id="manual-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isLoading}
            >

              {categoryOptions.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

           {error && <div className={styles.errorMessage}>{error}</div>} {/* Отображение ошибки */}

          <div className={styles.modalButtons}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading} 
            >
              {isLoading ? 'Отправка...' : 'Создать заявку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateManualRequestModal;
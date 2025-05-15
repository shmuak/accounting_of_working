import { useState } from 'react';
import { IConsumable } from '../../../shared/types';
import styles from '../../../shared/styles/pages/mechanic/mechanicRequests.module.scss';

interface UsedConsumable {
  id: string;
  quantity: number;
}

interface CompleteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (workDescription: string, usedConsumables: UsedConsumable[]) => Promise<void>;
  consumables: IConsumable[];
}

const CompleteRequestModal = ({ 
  isOpen, 
  onClose, 
  onComplete,
  consumables 
}: CompleteRequestModalProps) => {
  const [workDescription, setWorkDescription] = useState('');
  const [usedConsumables, setUsedConsumables] = useState<UsedConsumable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuantityChange = (consumableId: string, quantity: number) => {
    setUsedConsumables(prev => {
      const existing = prev.find(item => item.id === consumableId);
      if (existing) {
        return prev.map(item => 
          item.id === consumableId ? { ...item, quantity } : item
        );
      }
      return [...prev, { id: consumableId, quantity }];
    });
  };

  const toggleConsumable = (consumableId: string) => {
    setUsedConsumables(prev => 
      prev.some(item => item.id === consumableId)
        ? prev.filter(item => item.id !== consumableId)
        : [...prev, { id: consumableId, quantity: 1 }]
    );
  };

  const handleSubmit = async () => {
    if (!workDescription.trim()) {
      setError('Пожалуйста, укажите описание работы');
      return;
    }

    if (usedConsumables.some(item => item.quantity <= 0)) {
      setError('Количество расходников должно быть больше 0');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await onComplete(workDescription, usedConsumables);
      onClose();
    } catch (err) {
      setError('Не удалось завершить заявку. Пожалуйста, попробуйте снова.');
      console.log(err)
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Завершение заявки</h2>
        
        <div className={styles.formGroup}>
          <label>Описание проделанной работы:</label>
          <textarea
            value={workDescription}
            onChange={(e) => setWorkDescription(e.target.value)}
            rows={5}
            placeholder="Опишите какие работы были выполнены..."
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Использованные расходники:</label>
          <div className={styles.consumablesList}>
            {consumables.map(consumable => {
              const isSelected = usedConsumables.some(item => item.id === consumable._id);
              const selectedItem = usedConsumables.find(item => item.id === consumable._id);
              
              return (
                <div key={consumable._id} className={styles.consumableItem}>
                  <div className={styles.consumableCheckbox}>
                    <input
                      type="checkbox"
                      id={`consumable-${consumable._id}`}
                      checked={isSelected}
                      onChange={() => toggleConsumable(consumable._id)}
                      disabled={isLoading}
                    />
                    <label htmlFor={`consumable-${consumable._id}`}>
                      {consumable.name} ({consumable.unit})
                    </label>
                  </div>
                  
                  {isSelected && (
                    <div className={styles.quantityInput}>
                      <label>Количество:</label>
                      <input
                        type="number"
                        min="1"
                        max={consumable.quantity}
                        value={selectedItem?.quantity || 1}
                        onChange={(e) => 
                          handleQuantityChange(
                            consumable._id, 
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        disabled={isLoading}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.modalButtons}>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isLoading}
          >
            Отмена
          </button>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Подтвердить завершение'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteRequestModal;
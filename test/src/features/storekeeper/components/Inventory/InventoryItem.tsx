import { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import styles from '../../../../shared/styles/pages/storekeeper/inventory.module.scss';
import { Category, IConsumable } from '../../../../shared/types';

type InventoryItemProps = {
  item: {
    id: string;
    name: string;
    code: string;
    icon: React.ReactNode;
    category: Category;
    warehouse: string;
    quantity: number;
    status: 'low' | 'medium' | 'high';
    unit?: string;
  };
  view: 'list' | 'grid';
  onUpdate: (id: string, data: Partial<IConsumable>) => void;
  onDelete: (id: string) => void;
};

const InventoryItem = ({ item, view, onUpdate, onDelete }: InventoryItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: item.name,
    quantity: item.quantity.toString(),
    unit: item.unit || 'шт',
    category: item.category
  });

  const statusClasses = {
    low: styles.lowStock,
    medium: styles.mediumStock,
    high: styles.highStock
  };
  
  const quantityClasses = {
    low: styles.lowQuantity,
    medium: styles.mediumQuantity,
    high: styles.highQuantity
  };
  
  const categoryClasses: Record<Category, string> = {
    'Запчасти': styles.categoryParts,
    'Электроника': styles.categoryElectronics,
    'Расходники': styles.categoryConsumables,
    'Инструменты': styles.categoryTools,
    'Прочее': styles.categoryOther
  };

  const handleEditSubmit = () => {
    onUpdate(item.id, {
      ...editData,
      quantity: editData.quantity
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Удалить "${item.name}"?`)) {
      onDelete(item.id);
    }
  };

  if (view === 'list') {
    return (
      <>
        <div className={`${styles.listItem} ${statusClasses[item.status]}`}>
          <div className={styles.itemCell}>
            <div className={styles.itemIcon}>{item.icon}</div>
            <div>
              <p className={styles.itemName}>{item.name}</p>
              <p className={styles.itemCode}>{item.code}</p>
            </div>
          </div>
          <div className={styles.itemCell}>
            <span className={`${styles.categoryBadge} ${categoryClasses[item.category]}`}>
              {item.category}
            </span>
          </div>
          <div className={styles.itemCell}>
            {item.warehouse}
          </div>
          <div className={styles.itemCell}>
            <span className={`${styles.quantityBadge} ${quantityClasses[item.status]}`}>
              {item.quantity} {item.unit}
            </span>
          </div>
          <div className={styles.itemCell}>
            <div className={styles.itemActions}>
              <button 
                className={styles.actionButton}
                onClick={() => setIsEditing(true)}
              >
                <FaEdit />
              </button>
              <button 
                className={styles.actionButton}
                onClick={handleDelete}
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>Редактировать расходник</h2>
              <div className={styles.formGroup}>
                <label>Наименование:</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Количество:</label>
                <input
                  type="number"
                  value={editData.quantity}
                  onChange={(e) => setEditData({...editData, quantity: e.target.value})}
                  min="0"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Единица измерения:</label>
                <select
                  value={editData.unit}
                  onChange={(e) => setEditData({...editData, unit: e.target.value})}
                >
                  <option value="шт">шт</option>
                  <option value="кг">кг</option>
                  <option value="л">л</option>
                  <option value="м">м</option>
                  <option value="упак">упак</option>
                </select>
              </div>
              <div className={styles.modalButtons}>
                <button onClick={() => setIsEditing(false)}>Отмена</button>
                <button onClick={handleEditSubmit}>Сохранить</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Grid view
  return (
    <>
      <div className={`${styles.gridItem} ${statusClasses[item.status]}`}>
        <div className={styles.gridIcon}>{item.icon}</div>
        <div className={styles.gridDetails}>
          <h3 className={styles.gridName}>{item.name}</h3>
          <p className={styles.gridCode}>{item.code}</p>
          <div className={styles.gridMeta}>
            <span className={`${styles.categoryBadge} ${categoryClasses[item.category]}`}>
              {item.category}
            </span>
            <span>{item.warehouse}</span>
          </div>
          <div className={styles.gridFooter}>
            <span className={`${styles.quantityBadge} ${quantityClasses[item.status]}`}>
              {item.quantity} {item.unit}
            </span>
            <div className={styles.gridActions}>
              <button 
                className={styles.actionButton}
                onClick={() => setIsEditing(true)}
              >
                <FaEdit />
              </button>
              <button 
                className={styles.actionButton}
                onClick={handleDelete}
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Редактировать расходник</h2>
            <div className={styles.formGroup}>
              <label>Наименование:</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Количество:</label>
              <input
                type="number"
                value={editData.quantity}
                onChange={(e) => setEditData({...editData, quantity: e.target.value})}
                min="0"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Единица измерения:</label>
              <select
                value={editData.unit}
                onChange={(e) => setEditData({...editData, unit: e.target.value})}
              >
                <option value="шт">шт</option>
                <option value="кг">кг</option>
                <option value="л">л</option>
                <option value="м">м</option>
                <option value="упак">упак</option>
              </select>
            </div>
            <div className={styles.modalButtons}>
              <button onClick={() => setIsEditing(false)}>Отмена</button>
              <button onClick={handleEditSubmit}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryItem;
import { FaCog, FaBolt, FaTint, FaTools, FaPlug, FaList, FaTh } from 'react-icons/fa';
import InventoryItem from './InventoryItem';
import styles from '../../../../shared/styles/pages/storekeeper/inventory.module.scss';
import { IConsumable } from '../../../../shared/types';

type InventoryListProps = {
  activeView: 'list' | 'grid';
  setActiveView: (view: 'list' | 'grid') => void;
  consumables: IConsumable[];
  onUpdate: (id: string, data: Partial<IConsumable>) => void;
  onDelete: (id: string) => void;
};

const InventoryList = ({ 
  activeView, 
  setActiveView, 
  consumables,
  onUpdate,
  onDelete 
}: InventoryListProps) => {
  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'Запчасти': return <FaCog />;
      case 'Электроника': return <FaBolt />;
      case 'Расходники': return <FaTint />;
      case 'Инструменты': return <FaTools />;
      default: return <FaPlug />;
    }
  };

  const getStatus = (quantity: string): 'low' | 'medium' | 'high' => {
    const qty = parseInt(quantity);
    if (qty < 5) return 'low';
    if (qty < 10) return 'medium';
    return 'high';
  };

  const inventoryItems = consumables.map(item => ({
    id: item._id,
    name: item.name,
    code: `Арт. ${item._id.slice(0, 6).toUpperCase()}`,
    icon: getIconForCategory(item.category),
    category: item.category,
    warehouse: 'Основной склад',
    quantity: parseInt(item.quantity),
    status: getStatus(item.quantity), 
    unit: item.unit
  }));

  return (
    <div className={styles.inventoryList}>
      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>Инвентарь на складе</h2>
        <div className={styles.viewControls}>
          <button 
            className={`${styles.viewButton} ${activeView === 'list' ? styles.active : ''}`}
            onClick={() => setActiveView('list')}
          >
            <FaList />
          </button>
          <button 
            className={`${styles.viewButton} ${activeView === 'grid' ? styles.active : ''}`}
            onClick={() => setActiveView('grid')}
          >
            <FaTh />
          </button>
        </div>
      </div>
      
      <div className={styles.listContainer}>
        {activeView === 'list' ? (
          <>
            <div className={styles.listHeaderRow}>
              <div className={styles.headerCell}>Наименование</div>
              <div className={styles.headerCell}>Категория</div>
              <div className={styles.headerCell}>Склад</div>
              <div className={styles.headerCell}>Количество</div>
              <div className={styles.headerCell}>Действия</div>
            </div>
            
            {inventoryItems.map(item => (
              <InventoryItem 
                key={item.id} 
                item={item} 
                view="list"
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </>
        ) : (
          <div className={styles.gridView}>
            {inventoryItems.map(item => (
              <InventoryItem 
                key={item.id} 
                item={item} 
                view="grid"
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className={styles.listFooter}>
        <span className={styles.footerText}>
          Показано {inventoryItems.length} из {inventoryItems.length} позиций
        </span>
      </div>
    </div>
  );
};

export default InventoryList;
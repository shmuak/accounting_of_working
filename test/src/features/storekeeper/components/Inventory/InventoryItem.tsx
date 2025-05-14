import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import styles from '../../../../shared/styles/pages/storekeeper/inventory.module.scss';
type Category = 'Запчасти' | 'Электроника' | 'Расходники' | 'Инструменты';

type InventoryItemProps = {
  item: {
    id: string;
    name: string;
    code: string;
    icon: React.ReactNode;
    category: Category; // Используем наш тип
    warehouse: string;
    quantity: number;
    status: 'low' | 'medium' | 'high';
    unit?: string;
  };
  view: 'list' | 'grid';
};
const InventoryItem = ({ item, view }: InventoryItemProps) => {
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
    'Инструменты': styles.categoryTools
};
  
  if (view === 'list') {
    return (
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
            {item.quantity} шт
          </span>
        </div>
        <div className={styles.itemCell}>
          <div className={styles.itemActions}>
            <button className={styles.actionButton}>
              <FaEdit />
            </button>
            <button className={styles.actionButton}>
              <FaTrashAlt />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Grid view
  return (
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
            {item.quantity} шт
          </span>
          <div className={styles.gridActions}>
            <button className={styles.actionButton}>
              <FaEdit />
            </button>
            <button className={styles.actionButton}>
              <FaTrashAlt />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryItem;
import { useEffect, useState } from 'react';
import StatsCard from '../components/Inventory/StatsCard';
import InventoryList from '../components/Inventory/InventoryList';
import CreateConsumableModal from '../components/Inventory/CreateConsumableModal';
import styles from '../../../shared/styles/pages/storekeeper/inventory.module.scss';
import { IConsumable } from '../../../shared/types';
import { fetchInventory, createInventory } from '../api';

const InventoryPage = () => {
  const [activeView, setActiveView] = useState<'list' | 'grid'>('list');
  const [consumables, setConsumables] = useState<IConsumable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchInventory();
        setConsumables(data);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreateConsumable = async (newConsumable: Omit<IConsumable, '_id'>) => {
    try {
      const createdConsumable = await createInventory(newConsumable);
      setConsumables([...consumables, createdConsumable]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Ошибка при создании расходника:', err);
      setError('Не удалось создать расходник');
    }
  };

  // Рассчитываем статистику
  const totalItems = consumables.length;
  const lowStockItems = consumables.filter(item => parseInt(item.quantity) < 5).length;

  return (
    <div className={styles.inventoryPage}>
      <div className={styles.statsGrid}>
        <StatsCard 
          title="Всего позиций" 
          value={totalItems.toString()} 
          icon="boxes" 
          color="blue" 
        />
        <StatsCard 
          title="Низкий запас" 
          value={lowStockItems.toString()} 
          icon="warning" 
          color="red" 
        />
        <StatsCard 
          title="Новые заявки" 
          value="3" 
          icon="clipboard" 
          color="yellow" 
        />
      </div>
      
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Фильтры:</span>
          <select className={styles.filterSelect}>
            <option>Все категории</option>
            <option>Запчасти</option>
            <option>Инструменты</option>
            <option>Расходники</option>
            <option>Электроника</option>
          </select>
          <button 
            className={styles.addButton}
            onClick={() => setIsModalOpen(true)}
          >
            <span>Добавить расходник</span>
          </button>
        </div>
      </div>
      
      {loading ? (
        <div>Загрузка...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <InventoryList 
          activeView={activeView} 
          setActiveView={setActiveView} 
          consumables={consumables} 
        />
      )}

      <CreateConsumableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateConsumable}
      />
    </div>
  );
};

export default InventoryPage;
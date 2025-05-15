import { useEffect, useState, useMemo } from 'react';
import StatsCard from '../components/Inventory/StatsCard';
import InventoryList from '../components/Inventory/InventoryList';
import CreateConsumableModal from '../components/Inventory/CreateConsumableModal';
import styles from '../../../shared/styles/pages/storekeeper/inventory.module.scss';
import { IConsumable, ALL_CATEGORIES } from '../../../shared/types';
import { fetchInventory, createInventory, updateInventory, deleteInventory } from '../api';

const InventoryPage = () => {
  const [activeView, setActiveView] = useState<'list' | 'grid'>('list');
  const [consumables, setConsumables] = useState<IConsumable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все категории');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ALL_CATEGORIES;

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
      setConsumables(prev => [...prev, createdConsumable]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Ошибка при создании расходника:', err);
      setError('Не удалось создать расходник');
    }
  };

  const handleUpdateConsumable = async (id: string, updatedData: Partial<IConsumable>) => {
    try {
      const updatedConsumable = await updateInventory(id, updatedData);
      setConsumables(prev => 
        prev.map(item => item._id === id ? updatedConsumable : item)
      );
    } catch (err) {
      console.error('Ошибка при обновлении расходника:', err);
      setError('Не удалось обновить расходник');
    }
  };

  const handleDeleteConsumable = async (id: string) => {
    try {
      await deleteInventory(id);
      setConsumables(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Ошибка при удалении расходника:', err);
      setError('Не удалось удалить расходник');
    }
  };

  const filteredConsumables = useMemo(() => {
    let result = [...consumables];
    
    if (selectedCategory !== 'Все категории') {
      result = result.filter(item => item && item.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(query);
        const articleMatch = item._id.slice(0, 6).toLowerCase().includes(query);
        return nameMatch || articleMatch;
      });
    }
    
    return result;
  }, [consumables, selectedCategory, searchQuery]);

  const totalItems = filteredConsumables.length;
  const lowStockItems = filteredConsumables.filter(item => {
    if (!item || !item.quantity) return false;
    const quantity = parseInt(item.quantity);
    return !isNaN(quantity) && quantity < 5;
  }).length;

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
          <input
            type="text"
            placeholder="Поиск по названию или артикулу..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className={styles.filterSelect}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
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
          consumables={filteredConsumables}
          onUpdate={handleUpdateConsumable}
          onDelete={handleDeleteConsumable}
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
import { useState } from 'react';
import styles from '../../../shared/styles/pages/mechanic/warehousePage.module.scss';

interface IConsumable {
  id: string;
  name: string;
  description: string;
  quantity: number;
  location: string;
  unit: string;
}

const WarehousePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Пример данных расходников
  const consumables: IConsumable[] = [
    {
      id: '1',
      name: 'Подшипник 6308',
      description: 'Для шпинделя токарного станка',
      quantity: 12,
      location: 'Стеллаж 5, полка 3',
      unit: 'шт'
    },
    // Другие расходники...
  ];

  const filteredConsumables = consumables.filter(consumable =>
    consumable.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consumable.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Склад</h1>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="fas fa-search"></i>
        </div>
      </div>

      <div className={styles.grid}>
        {filteredConsumables.map((consumable) => (
          <div key={consumable.id} className={styles.consumableCard}>
            <div className={styles.cardHeader}>
              <h3>{consumable.name}</h3>
              <span className={
                consumable.quantity > 10 ? styles.inStockHigh :
                consumable.quantity > 0 ? styles.inStockLow :
                styles.outOfStock
              }>
                В наличии: {consumable.quantity} {consumable.unit}
              </span>
            </div>
            <p className={styles.description}>{consumable.description}</p>
            <div className={styles.cardFooter}>
              <span className={styles.location}>{consumable.location}</span>
              <button className={styles.orderButton}>Заказать</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarehousePage;
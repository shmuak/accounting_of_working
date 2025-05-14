import { useState } from 'react';
import styles from '../../../shared/styles/pages/mechanic/purchasesPage.module.scss';

interface IPurchase {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  date: string;
  status: 'processing' | 'completed' | 'cancelled';
}

const PurchasesPage = () => {
  const [purchases, setPurchases] = useState<IPurchase[]>([
    {
      id: 'P-1245',
      name: 'Масло И-20А',
      quantity: 5,
      unit: 'л',
      date: '10.06.2023',
      status: 'processing'
    },
    // Другие заявки...
  ]);

  const handleCancel = (id: string) => {
    setPurchases(purchases.filter(purchase => purchase.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Заявки на закупку</h1>
        <button className={styles.newPurchaseButton}>
          <i className="fas fa-plus"></i> Новая заявка
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>№ заявки</th>
              <th>Наименование</th>
              <th>Количество</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.id}>
                <td>#{purchase.id}</td>
                <td>{purchase.name}</td>
                <td>{purchase.quantity} {purchase.unit}</td>
                <td>{purchase.date}</td>
                <td>
                  {purchase.status === 'processing' && (
                    <span className={styles.statusProcessing}>В обработке</span>
                  )}
                  {purchase.status === 'completed' && (
                    <span className={styles.statusCompleted}>Выполнено</span>
                  )}
                </td>
                <td>
                  <button className={styles.detailsButton}>Подробнее</button>
                  {purchase.status === 'processing' && (
                    <button 
                      className={styles.cancelButton}
                      onClick={() => handleCancel(purchase.id)}
                    >
                      Отменить
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchasesPage;
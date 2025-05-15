import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { IUser, IConsumableRequest } from '../../../shared/types';
import { fetchConsumableRequests, cancelConsumableRequest } from '../api';
import styles from '../../../shared/styles/pages/mechanic/purchasesPage.module.scss';

const PurchasesPage = () => {
  const [requests, setRequests] = useState<IConsumableRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const user = useSelector((state: RootState) => state.auth.user) as IUser | null;

useEffect(() => {
  const loadRequests = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      // Передаем объект с параметрами вместо строки
      const data = await fetchConsumableRequests({ masterId: user._id });
      setRequests(data);
    } catch (err) {
      console.error('Ошибка при загрузке заявок:', err);
      setError('Не удалось загрузить заявки');
    } finally {
      setLoading(false);
    }
  };

  loadRequests();
}, [user]);
  const handleCancel = async (id: string) => {
    try {
      await cancelConsumableRequest(id);
      setRequests(prev => prev.filter(request => request._id !== id));
    } catch (err) {
      console.error('Ошибка при отмене заявки:', err);
      setError('Не удалось отменить заявку');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };



  if (loading) return <div className={styles.container}>Загрузка заявок...</div>;
  if (error) return <div className={styles.container}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Мои заявки на расходники</h1>
      </div>

      <div className={styles.tableContainer}>
        {requests.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>№</th>
                <th>Наименование</th>
                <th>Кол-во</th>
                <th>Категория</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td>#{request._id.slice(-4)}</td>
                  <td>{request.name}</td>
                  <td>{request.quantity} {request.unit}</td>
                  <td>{request.category}</td>
                  <td>{formatDate(request.createdAt)}</td>
                  <td>
                  </td>
                  <td>
                    
                      <button 
                        className={styles.cancelButton}
                        onClick={() => handleCancel(request._id)}
                      >
                        Отменить
                      </button>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.noRequests}>Нет созданных заявок</div>
        )}
      </div>
    </div>
  );
};

export default PurchasesPage;
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { IUser, IConsumableRequest, ConsumableRequestStatus } from '../../../shared/types';
import { fetchConsumableRequests, cancelConsumableRequest } from '../api';
import styles from '../../../shared/styles/pages/mechanic/purchasesPage.module.scss';

const statusFilters = [
  { value: 'all', label: 'Все статусы' },
  { value: 'В обработке', label: 'В обработке' },
  { value: 'Принято', label: 'Принято' },
  { value: 'Прибыло', label: 'Прибыло' },
  { value: 'Отменено', label: 'Отменено' }
];

const PurchasesPage = () => {
  const [requests, setRequests] = useState<IConsumableRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<IConsumableRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ConsumableRequestStatus | 'all'>('all');
  
  const user = useSelector((state: RootState) => state.auth.user) as IUser | null;

  useEffect(() => {
    const loadRequests = async () => {
      if (!user?._id) return;
      
      try {
        setLoading(true);
        const data = await fetchConsumableRequests({ masterId: user._id });
        // Исключаем заявки со статусом "Выполнено"
        const filteredData = data.filter(request => request.status.trim() !== 'Выполнено');
        setRequests(filteredData);
        setFilteredRequests(filteredData);
      } catch (err) {
        console.error('Ошибка при загрузке заявок:', err);
        setError('Не удалось загрузить заявки');
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [user]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(request => request.status.trim() === statusFilter));
    }
  }, [statusFilter, requests]);

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
        <div className={styles.filters}>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ConsumableRequestStatus | 'all')}
            className={styles.filterSelect}
          >
            {statusFilters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {filteredRequests.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>№</th>
                <th>Наименование</th>
                <th>Кол-во</th>
                <th>Категория</th>
                <th>Статус</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request._id}>
                  <td>#{request._id.slice(-4)}</td>
                  <td>{request.name}</td>
                  <td>{request.quantity} {request.unit}</td>
                  <td>{request.category}</td>
                  <td className={request.status}>
                    {request.status}
                  </td>
                  <td>{formatDate(request.createdAt)}</td>
                  <td>
                    {request.status.trim() !== 'Отменено' && (
                      <button 
                        className={styles.cancelButton}
                        onClick={() => handleCancel(request._id)}
                      >
                        Отменить
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.noRequests}>
            {statusFilter === 'all' ? 'Нет активных заявок' : `Нет заявок со статусом "${statusFilters.find(f => f.value === statusFilter)?.label}"`}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasesPage;
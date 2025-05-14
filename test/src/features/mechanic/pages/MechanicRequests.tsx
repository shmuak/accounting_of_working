import { useState, useEffect } from 'react';
import { IRequestMechanic, IUser } from '../../../shared/types/index';
import styles from '../../../shared/styles/pages/mechanic/mechanicRequests.module.scss';
import { fetchRequestsMechabnic } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { logout } from '../../auth/authSlice';

const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'completed'>('current');
  const [requests, setRequests] = useState<IRequestMechanic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
const user = useSelector((state: RootState) => state.auth.user) as IUser | null;
  
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setIsLoading(true);
        const data = await fetchRequestsMechabnic();
        // Фильтруем запросы для текущего механика
        const mechanicRequests = user 
          ? data.filter(req => 
              typeof req.masterId === 'string' 
                ? req.masterId === user._id 
                : req.masterId._id === user._id
            )
          : [];
        setRequests(mechanicRequests);
      } catch (err) {
        console.error('Error fetching mechanic requests:', err);
        dispatch(logout());
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, [dispatch, user]);

  // Разделяем запросы на текущие и завершенные
  const currentRequests = requests.filter(req => req.status !== 'Completed');
  const completedRequests = requests.filter(req => req.status === 'Completed');

  const handleCompleteRequest = async (requestId: string) => {
    try {
      // Здесь должен быть вызов API для обновления статуса заявки
      // await completeRequestMechanic(requestId);
      // Обновляем локальное состояние
      setRequests(requests.map(req => 
        req._id === requestId ? { ...req, status: 'Completed' } : req
      ));
      alert('Заявка успешно завершена');
    } catch (err) {
      console.error('Error completing request:', err);
      alert('Не удалось завершить заявку');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <i className="fas fa-spinner fa-spin"></i> Загрузка данных...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Мои заявки</h1>

      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'current' ? styles.active : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Текущие заявки ({currentRequests.length})
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'completed' ? styles.active : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Завершенные заявки ({completedRequests.length})
        </button>
      </div>

      {activeTab === 'current' && (
        <div className={styles.tableContainer}>
          {currentRequests.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="fas fa-inbox"></i>
              <p>Нет текущих заявок</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>№ заявки</th>
                  <th>Оборудование</th>
                  <th>Описание</th>
                  <th>Дата создания</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {currentRequests.map((request) => (
                  <tr key={request._id}>
                    <td>#{request._id.slice(-4)}</td>
                    <td>
                      {typeof request.equipmentId === 'object' 
                        ? request.equipmentId.name 
                        : 'Оборудование не найдено'}
                    </td>
                    <td>{request.description || '—'}</td>
                    <td>{request.createdAt ? formatDate(request.createdAt) : '—'}</td>
                    <td>
                      <button className={styles.detailsButton}>Подробнее</button>
                      <button 
                        className={styles.completeButton}
                        onClick={() => handleCompleteRequest(request._id)}
                      >
                        Завершить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'completed' && (
        <div className={styles.tableContainer}>
          {completedRequests.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="fas fa-inbox"></i>
              <p>Нет завершенных заявок</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>№ заявки</th>
                  <th>Оборудование</th>
                  <th>Описание</th>
                  <th>Дата завершения</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {completedRequests.map((request) => (
                  <tr key={request._id}>
                    <td>#{request._id.slice(-4)}</td>
                    <td>
                      {typeof request.equipmentId === 'object' 
                        ? request.equipmentId.name 
                        : 'Оборудование не найдено'}
                    </td>
                    <td>{request.description || '—'}</td>
                    <td>
                      {request.updatedAt ? formatDate(request.updatedAt) : '—'}
                    </td>
                    <td>
                      <span className={styles.statusCompleted}>Завершено</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
import { useEffect, useState } from 'react';
import styles from '../../../shared/styles/pages/dispatcher/DispatcherRequests.module.scss';
import { IEquipment, IRequest, IWorkshop } from '../../../shared/types';
import { fetchRequests } from '../../master/api';

const DispatcherRequests = () => {
  const [activeTab] = useState('all');
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        const data = await fetchRequests();
        setRequests(data);
      } catch (err) {
        console.error('Ошибка при загрузке заявок:', err);
        setError('Не удалось загрузить заявки');
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const filteredRequests = activeTab === 'all'
    ? requests
    : requests.filter(req => req.status === activeTab);

  const statusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Новая';
      case 'in-progress': return 'В работе';
      case 'completed': return 'Завершено';
      case 'rejected': return 'Отклонено';
      default: return status;
    }
  };

  return (
    <div className={styles.requests}>
      <div className={styles.header}>
        <h2>Управление заявками</h2>
        <div className={styles.actions}>
          <button className={styles.primaryButton}>
            <i className="fas fa-plus"></i> Новая заявка
          </button>
          <button className={styles.secondaryButton}>
            <i className="fas fa-filter"></i> Фильтр
          </button>
        </div>
      </div>

      {loading ? (
        <p>Загрузка заявок...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          <div className={styles.stats}>
            {['new', 'in-progress', 'completed', 'rejected'].map(stat => (
              <div className={styles.statCard} key={stat}>
                <div>
                  <p className={styles.statLabel}>{statusLabel(stat)}</p>
                  <p className={styles.statValue}>
                    {requests.filter(r => r.status === stat).length}
                  </p>
                </div>
                <div className={`${styles.statIcon} ${styles[stat]}`}>
                  <i className={
                    stat === 'new' ? 'fas fa-file-alt' :
                    stat === 'in-progress' ? 'fas fa-tools' :
                    stat === 'completed' ? 'fas fa-check-circle' :
                    'fas fa-times-circle'
                  }></i>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.requestsTable}>
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Оборудование</th>
                  <th>Цех</th>
                  <th>Описание</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(request => {
                    const equipment = request.equipmentId as IEquipment;
                    const workshop = equipment?.workshopId as IWorkshop;


                  return (
                    <tr key={request._id}>
                      <td>{request.title}</td>
                      <td>{equipment?.name || '—'}</td>
                      <td>{workshop?.name || '—'}</td>
                      <td>{request.description || '—'}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[request.status]}`}>
                          {statusLabel(request.status)}
                        </span>
                      </td>
                      <td>
                        <button className={styles.tableButton}>Назначить</button>
                        <button className={styles.tableButton}>Подробнее</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default DispatcherRequests;

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IRequestMechanic, IUser } from '../../../shared/types/index';
import styles from '../../../shared/styles/pages/adjuster/adjusterPages.module.scss';
import $api from "../../../shared/api/axios";
import { RootState } from '../../../store';

const NewRequestsPage = () => {
  const [requests, setRequests] = useState<IRequestMechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = useSelector((state: RootState) => state.auth.user) as IUser | null;

  // Функция для получения заявок
const fetchRequests = async (): Promise<IRequestMechanic[]> => {
  const workshopId = user?.workshop; // Предполагая, что workshopId есть в user
  const response = await $api.get(`/adjuster/requests?workshopId=${workshopId}`);
  return response.data.requests;
};
  // Функция для обновления статуса заявки
  const updateRequestStatus = async (requestId: string, status: string): Promise<void> => {
    await $api.patch(`/adjuster/requests/${requestId}`, { status });
  };

  // Функция для завершения заявки и переноса в ComplitedRequests
  const completeRequest = async (requestId: string): Promise<void> => {
  if (!user) {
    throw new Error('Пользователь не авторизован');
  }

  // 1. Получаем данные заявки
  const requestToComplete = requests.find(req => req._id === requestId);
  if (!requestToComplete) {
    throw new Error('Заявка не найдена');
  }

  // 2. Проверяем типы и извлекаем ID
  const equipmentId = typeof requestToComplete.equipmentId === 'string' 
    ? requestToComplete.equipmentId 
    : requestToComplete.equipmentId?._id;
  
  const masterId = typeof requestToComplete.masterId === 'string' 
    ? requestToComplete.masterId 
    : requestToComplete.masterId?._id;

  if (!equipmentId || !masterId) {
    throw new Error('Неверные данные оборудования или мастера');
  }

  // 3. Создаем завершенную заявку
  await $api.post('/adjuster/complited-requests', {
    title: requestToComplete.title,
    description: requestToComplete.description,
    equipmentId,
    masterId,
    ajusterId: user._id,
    originalRequestId: requestToComplete._id
  });

  // 4. Удаляем оригинальную заявку
  await $api.delete(`/adjuster/requests/${requestId}`);
};
  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchRequests();
        setRequests(data);
      } catch (err) {
        setError('Ошибка при загрузке заявок');
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const handleAcceptRequest = async (requestId: string) => {
    if (!user) {
      setError('Пользователь не авторизован');
      return;
    }

    try {
      await updateRequestStatus(requestId, 'Approved');
      setRequests(requests.map(req => 
        req._id === requestId ? { ...req, status: 'Approved' } : req
      ));
    } catch (err) {
      console.error('Error updating request:', err);
      setError('Ошибка при обновлении заявки');
    }
  };

  const handleCompleteRequest = async (requestId: string) => {
    if (!user) {
      setError('Пользователь не авторизован');
      return;
    }

    try {
      await completeRequest(requestId);
      // Удаляем заявку из локального состояния
      setRequests(requests.filter(req => req._id !== requestId));
    } catch (err) {
      console.error('Error completing request:', err);
      setError('Ошибка при завершении заявки');
    }
  };

  if (loading) {
    return <div className={styles.pageContainer}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.pageContainer}>{error}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.requestsContainer}>
        <div className={styles.requestsHeader}>
          <h2>Новые заявки</h2>
          <div className={styles.sortOptions}>
            <button className={styles.sortButton}>
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {requests.length === 0 ? (
          <div className={styles.noRequests}>Нет новых заявок</div>
        ) : (
          <div className={styles.requestsList}>
            {requests.map(request => (
              <div key={request._id} className={styles.requestCard}>
                <div className={styles.requestIcon}>
                  <div className={styles.iconWrapper}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                </div>
                
                <div className={styles.requestContent}>
                  <div className={styles.requestHeader}>
                    <h3 className={styles.requestTitle}>{request.title}</h3>

                  </div>
                  
                  {request.masterId && (
                    <p className={styles.requestSubtitle}>
                      Слесарь: {typeof request.masterId === 'object' 
                        ? request.masterId.login 
                        : request.masterId}
                    </p>
                  )}
                  
                  <p className={styles.requestDescription}>
                    {request.description}
                  </p>
                  
                  {request.equipmentId && (
                    <div className={styles.requestMeta}>
                      <span className={styles.metaItem}>
                        Оборудование: {typeof request.equipmentId === 'object' 
                          ? request.equipmentId.name 
                          : request.equipmentId}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className={styles.requestActions}>
                  {request.status === 'Pending' ? (
                    <button 
                      className={styles.primaryButton}
                      onClick={() => handleAcceptRequest(request._id)}
                    >
                      Принять
                    </button>
                  ) : (
                    <button 
                      className={styles.successButton}
                      onClick={() => handleCompleteRequest(request._id)}
                    >
                      Завершить
                    </button>
                  )}
                  <button className={styles.secondaryButton}>
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewRequestsPage;
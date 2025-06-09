import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IRequestMechanic, IUser, IEquipment } from '../../../shared/types/index';
import styles from '../../../shared/styles/pages/adjuster/adjusterPages.module.scss';
import $api from "../../../shared/api/axios";
import { RootState } from '../../../app/store';

interface CompletedRequest extends IRequestMechanic {
  ajusterId: string | { _id: string; login: string };
  completedAt?: string;
  equipmentId: IEquipment | string;
}

const CompletedRequestsPage = () => {
  const [requests, setRequests] = useState<CompletedRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<CompletedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [mechanicFilter, setMechanicFilter] = useState('');
  const user = useSelector((state: RootState) => state.auth.user) as IUser | null;

  // Получаем уникальные списки оборудования и механиков для фильтров
  // const equipments = Array.from(new Set(
  //   requests.map(request => 
  //     typeof request.equipmentId === 'object' 
  //       ? request.equipmentId.name 
  //       : 'Неизвестное оборудование'
  //   )
  // ));

  const mechanics = Array.from(new Set(
    requests.map(request => 
      typeof request.masterId === 'object' 
        ? request.masterId.login 
        : 'Неизвестный мастер'
    )
  ));

  useEffect(() => {
    const fetchCompletedRequests = async () => {
      try {
        if (!user) {
          throw new Error('Пользователь не авторизован');
        }

        const response = await $api.get<{ requests: CompletedRequest[] }>('/adjuster/complited');
        const ajusterRequests = response.data.requests.filter(req => {
          const ajusterId = typeof req.ajusterId === 'object' ? req.ajusterId._id : req.ajusterId;
          return ajusterId === user._id;
        });
        
        setRequests(ajusterRequests);
        setFilteredRequests(ajusterRequests);
      } catch (err) {
        console.error('Error fetching completed requests:', err);
        setError('Ошибка при загрузке выполненных заявок');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedRequests();
  }, [user]);

  // Применяем фильтры при их изменении
  useEffect(() => {
    let result = [...requests];
    
    if (equipmentFilter) {
      result = result.filter(request => {
        const equipmentName = typeof request.equipmentId === 'object' 
          ? request.equipmentId.name 
          : 'Неизвестное оборудование';
        return equipmentName.includes(equipmentFilter);
      });
    }
    
    if (mechanicFilter) {
      result = result.filter(request => {
        const mechanicName = typeof request.masterId === 'object' 
          ? request.masterId.login 
          : 'Неизвестный мастер';
        return mechanicName.includes(mechanicFilter);
      });
    }
    
    setFilteredRequests(result);
  }, [equipmentFilter, mechanicFilter, requests]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Дата неизвестна';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.requestsContainer}>
        <div className={styles.requestsHeader}>
          <h2>Выполненные заявки</h2>
          
          {/* Фильтры */}
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label htmlFor="equipmentFilter">Оборудование:</label>
              <select
                id="equipmentFilter"
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Все оборудование</option>
                {/* {equipments.map((equipment, index) => (
                  <option key={index} value={equipment}>
                    {equipment}
                  </option>
                ))} */}
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label htmlFor="mechanicFilter">Слесарь:</label>
              <select
                id="mechanicFilter"
                value={mechanicFilter}
                onChange={(e) => setMechanicFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Все слесари</option>
                {mechanics.map((mechanic, index) => (
                  <option key={index} value={mechanic}>
                    {mechanic}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {filteredRequests.length === 0 ? (
          <div className={styles.emptyState}>
            {requests.length === 0 
              ? 'Нет выполненных заявок' 
              : 'Нет заявок, соответствующих фильтрам'}
          </div>
        ) : (
          <div className={styles.requestsList}>
            {filteredRequests.map(request => (
              <div key={request._id} className={styles.requestCard}>
                <div className={styles.requestIcon}>
                  <div className={`${styles.iconWrapper} ${styles.completedIcon}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                
                <div className={styles.requestContent}>
                  <div className={styles.requestHeader}>
                    <h3 className={styles.requestTitle}>{request.title}</h3>
                    <span className={`${styles.statusBadge} ${styles.statusCompleted}`}>
                      Выполнено
                    </span>
                  </div>
                  
                  <p className={styles.requestSubtitle}>
                    Слесарь: {typeof request.masterId === 'object' 
                      ? request.masterId.login 
                      : 'Неизвестный мастер'}
                  </p>
                  
                  <p className={styles.requestDescription}>
                    {request.description}
                  </p>
                  
                  <div className={styles.requestMeta}>
                    <span className={styles.metaItem}>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {formatDate(request.completedAt || request.updatedAt || request.createdAt)}
                    </span>
                    
                    <span className={styles.metaItem}>
                      Оборудование: {typeof request.equipmentId === 'object' 
                        ? request.equipmentId.name 
                        : 'Неизвестное оборудование'}
                    </span>
                  </div>
                </div>
                
                <div className={styles.requestActions}>
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

export default CompletedRequestsPage;
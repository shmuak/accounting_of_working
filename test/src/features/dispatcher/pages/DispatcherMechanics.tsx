import { useEffect, useState } from 'react';
import styles from '../../../shared/styles/pages/dispatcher/DispatcherMechanics.module.scss';
import { fetchUsers, fetchRequestsMechabnic } from '../api';
import { IUser, IWorkshop, IRequestMechanic } from '../../../shared/types';

type WorkshopWithString = IWorkshop | string;

const DispatcherMechanics = () => {
  const [mechanics, setMechanics] = useState<IUser[]>([]);
  const [allWorkshops, setAllWorkshops] = useState<IWorkshop[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<IRequestMechanic[]>([]);

  // Функция для преобразования workshop в объект IWorkshop
  const normalizeWorkshop = (workshop: WorkshopWithString): IWorkshop | null => {
    if (typeof workshop === 'string') {
      return null;
    }
    return workshop;
  };

  // Функция для получения ID цеха
  const getWorkshopId = (workshop: WorkshopWithString): string | null => {
    const normalized = normalizeWorkshop(workshop);
    return normalized?._id || null;
  };

  // Функция для получения названия цеха
  const getWorkshopName = (workshop: WorkshopWithString): string => {
    const normalized = normalizeWorkshop(workshop);
    return normalized?.name || 'Не указан';
  };

  // Функция для подсчета задач механика
// Функция для подсчета задач механика
const countMechanicTasks = (mechanicId: string): number => {
  return requests.filter(request => {
    if (typeof request.masterId === 'string') {
      return request.masterId === mechanicId;
    } else if (request.masterId && typeof request.masterId === 'object') {
      return request.masterId._id.toString() === mechanicId;
    }
    return false;
  }).length;
};

  useEffect(() => {
    const loadData = async () => {
      try {
        const [users, mechanicRequests] = await Promise.all([
          fetchUsers(),
          fetchRequestsMechabnic()
        ]);
        
        const mechanicsData = users.filter((user: IUser) => user.role === 'MECHANIC');
        
        // Собираем уникальные цеха
        const workshopsMap = new Map<string, IWorkshop>();
        
        mechanicsData.forEach((user: IUser) => {
          const workshop = normalizeWorkshop(user.workshop);
          if (workshop && !workshopsMap.has(workshop._id)) {
            workshopsMap.set(workshop._id, workshop);
          }
        });

        setMechanics(mechanicsData);
        setAllWorkshops(Array.from(workshopsMap.values()));
        setRequests(mechanicRequests);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Фильтруем механиков по выбранному цеху
  const filteredMechanics = selectedWorkshop 
    ? mechanics.filter(mechanic => {
        const workshopId = getWorkshopId(mechanic.workshop);
        return workshopId === selectedWorkshop;
      })
    : mechanics;

  if (loading) {
    return <div>Загрузка данных...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Управление слесарями</h2>
        <button className={styles.primaryButton}>
          <i className="fas fa-user-plus"></i> Добавить слесаря
        </button>
      </div>

      <div className={styles.filterSection}>
        <label htmlFor="workshopFilter">Фильтр по цеху:</label>
        <select
          id="workshopFilter"
          value={selectedWorkshop}
          onChange={(e) => setSelectedWorkshop(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Все цеха</option>
          {allWorkshops.map(workshop => (
            <option key={workshop._id} value={workshop._id}>
              {workshop.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.mechanicsGrid}>
        {filteredMechanics.length > 0 ? (
          filteredMechanics.map(mechanic => (
            <div key={mechanic._id} className={styles.mechanicCard}>
              <div className={styles.mechanicHeader}>
                <div>
                  <h3 className={styles.mechanicName}>{mechanic.login}</h3>
                  <p className={styles.mechanicPosition}> {mechanic.role}</p>
                  <p className={styles.mechanicWorkshop}>
                    Цех: {getWorkshopName(mechanic.workshop)}
                  </p>
                </div>
              </div>

              <div className={styles.mechanicStats}>
                <div className={styles.statItem}>
                  <span>Текущих задач:</span>
                  
                  <span>{countMechanicTasks(mechanic._id)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            {selectedWorkshop 
              ? 'В выбранном цехе нет механиков' 
              : 'Нет доступных механиков'}
          </div>
        )}
      </div>
    </div>
  );
};

export default DispatcherMechanics;
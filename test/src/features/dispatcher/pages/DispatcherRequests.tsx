import { useEffect, useState } from 'react';
import styles from '../../../shared/styles/pages/dispatcher/DispatcherRequests.module.scss';
import { IEquipment, IRequest, IUser, IWorkshop } from '../../../shared/types';
import { fetchRequests, deleteRequest } from '../../master/api';
import { fetchUsers } from '../api';
import { createRequestsMechanic } from '../api';

const DispatcherRequests = () => {
  const [activeTab] = useState('all');
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mechanics, setMechanics] = useState<IUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<IRequest | null>(null);
  const [selectedMechanic, setSelectedMechanic] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [requestsData, usersData] = await Promise.all([
          fetchRequests(),
          fetchUsers()
        ]);
        setRequests(requestsData);
        setMechanics(usersData);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAssignClick = (request: IRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleMechanicSelect = (mechanicId: string) => {
    setSelectedMechanic(mechanicId);
  };

  const handleAssignSubmit = async () => {
    if (!selectedRequest || !selectedMechanic) return;

    try {
      // Создаем новую заявку для механика
      await createRequestsMechanic({
        title: selectedRequest.title,
        description: selectedRequest.description,
        equipmentId: selectedRequest.equipmentId,
        masterId: selectedMechanic,
        status: 'Pending'
      });
      await deleteRequest(selectedRequest._id);

      setRequests(requests.filter(req => req._id !== selectedRequest._id));      
      setIsModalOpen(false);
      setSelectedRequest(null);
      setSelectedMechanic(null);
    } catch (err) {
      console.error('Ошибка при назначении заявки:', err);
      setError('Не удалось назначить заявку');
    }
  };

  const filteredRequests = activeTab === 'all'
    ? requests
    : requests.filter(req => req.status === activeTab);

  const statusLabel = (status: string) => {
    switch (status) {
      case 'in-progress': return 'В работе';
      case 'completed': return 'Завершено';
      case 'rejected': return 'Отклонено';
      default: return status;
    }
  };

  // Фильтруем механиков по цеху выбранной заявки
  const getMechanicsForWorkshop = () => {
    if (!selectedRequest || !selectedRequest.equipmentId) return [];
  
    // Получаем оборудование (может быть объектом или строкой ID)
    const equipment = selectedRequest.equipmentId as IEquipment;
    
    // Получаем workshopId разными способами в зависимости от типа
    let workshopId: string | undefined;
    
    if (typeof equipment === 'string') {
      // Если equipmentId - это просто строка (ID), мы не можем получить workshop
      // В этом случае нужно либо загрузить оборудование, либо вернуть пустой список
      return [];
    } else {
      // Если equipment - это объект IEquipment
      if (typeof equipment.workshopId === 'string') {
        workshopId = equipment.workshopId;
      } else {
        workshopId = (equipment.workshopId as IWorkshop)?._id;
      }
    }
  
    if (!workshopId) return [];
  
    return mechanics.filter(user => {
      if (user.role !== 'MECHANIC') return false;
      
      // Проверяем workshop пользователя
      if (typeof user.workshop === 'string') {
        return user.workshop === workshopId;
      } else {
        return (user.workshop as IWorkshop)?._id === workshopId;
      }
    });
  };

  return (
    <div className={styles.requests}>
      <div className={styles.header}>
        <h2>Управление заявками</h2>
        <div className={styles.actions}>
          <button className={styles.primaryButton}>
            <i className="fas fa-plus"></i> Новая заявка
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
            {['Pending', 'completed'].map(stat => (
              <div className={styles.statCard} key={stat}>
                <div>
                  <p className={styles.statLabel}>{statusLabel(stat)}</p>
                  <p className={styles.statValue}>
                    {requests.filter(r => r.status === stat).length}
                  </p>
                </div>
                <div className={`${styles.statIcon} ${styles[stat]}`}>
                  <i className={
                    stat === 'Pending' ? 'fas fa-tools' :
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
                        <button 
                          className={styles.tableButton}
                          onClick={() => handleAssignClick(request)}
                        >
                          Назначить
                        </button>
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

{isModalOpen && selectedRequest && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h3>Назначить заявку механику</h3>
        <button 
          className={styles.modalClose}
          onClick={() => {
            setIsModalOpen(false);
            setSelectedRequest(null);
            setSelectedMechanic(null);
          }}
        >
          &times;
        </button>
      </div>
      <div className={styles.modalBody}>
        <p>
          <strong>Заявка:</strong> {selectedRequest.title}
        </p>
        <p>
          <strong>Оборудование:</strong> {typeof selectedRequest.equipmentId === 'object' 
            ? (selectedRequest.equipmentId as IEquipment)?.name 
            : '—'}
        </p>
        <p>
          <strong>Цех:</strong> {typeof selectedRequest.equipmentId === 'object' 
            ? typeof (selectedRequest.equipmentId as IEquipment).workshopId === 'object'
              ? ((selectedRequest.equipmentId as IEquipment).workshopId as IWorkshop)?.name
              : '—'
            : '—'}
        </p>
        
        <div className={styles.mechanicsList}>
          <h4>Доступные механики:</h4>
          {getMechanicsForWorkshop().length > 0 ? (
            <ul>
              {getMechanicsForWorkshop().map(mechanic => (
                <li key={mechanic._id}>
                  <label>
                    <input
                      type="radio"
                      name="mechanic"
                      checked={selectedMechanic === mechanic._id}
                      onChange={() => handleMechanicSelect(mechanic._id)}
                    />
                    {mechanic.login}
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.noMechanicsMessage}>
              Нет доступных механиков для этого цеха
            </div>
          )}
        </div>
      </div>
      <div className={styles.modalFooter}>
        <button
          className={styles.cancelButton}
          onClick={() => {
            setIsModalOpen(false);
            setSelectedRequest(null);
            setSelectedMechanic(null);
          }}
        >
          Отмена
        </button>
        <button
          className={styles.confirmButton}
          onClick={handleAssignSubmit}
          disabled={!selectedMechanic}
        >
          Назначить
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default DispatcherRequests;
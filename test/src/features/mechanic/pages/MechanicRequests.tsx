import { useState, useEffect } from 'react';

import { IRequestMechanic, IUser, IConsumable, UsedConsumable } from '../../../shared/types';
import styles from '../../../shared/styles/pages/mechanic/mechanicRequests.module.scss';
import { 
  fetchRequestsMechabnic, 
  completeRequestMechanic,
  createAjasterRequest,
  fetchInventory
} from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { logout } from '../../auth/authSlice';
import RequestDetailsModal from '../components/RequestDetailsModal';
import CompleteRequestModal from '../components/CompleteRequestModal';


const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'Completed'>('current');
  const [requests, setRequests] = useState<IRequestMechanic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<IRequestMechanic | null>(null);
  const [requestToComplete, setRequestToComplete] = useState<IRequestMechanic | null>(null);
  const [consumables, setConsumables] = useState<IConsumable[]>([]);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user) as IUser | null;
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [requestsData, consumablesData] = await Promise.all([
          fetchRequestsMechabnic(),
          fetchInventory()
        ]);
        
        const mechanicRequests = user 
          ? requestsData.filter(req => 
              typeof req.masterId === 'string' 
                ? req.masterId === user._id 
                : req.masterId._id === user._id
            )
          : [];
          
        setRequests(mechanicRequests);
        setConsumables(consumablesData);
      } catch (err) {
        console.error('Error loading data:', err);
        dispatch(logout());
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch, user]);

  const currentRequests = requests.filter(req => req.status !== 'Completed');
  const completedRequests = requests.filter(req => req.status === 'Completed');

  const handleShowDetails = (request: IRequestMechanic) => {
    setSelectedRequest(request);
  };

  const handleInitiateComplete = (request: IRequestMechanic) => {
    setRequestToComplete(request);
  };

  const handleCompleteWithDetails = async (workDescription: string, usedConsumables: UsedConsumable[]) => {
  if (!requestToComplete || !user) return;
  
  try {
    // 1. Завершаем заявку механика
    await completeRequestMechanic(requestToComplete._id);
    
    // 2. Получаем equipmentId
    const equipmentId = typeof requestToComplete.equipmentId === 'object' 
      ? requestToComplete.equipmentId._id 
      : requestToComplete.equipmentId;

    if (!equipmentId) {
      throw new Error('Equipment ID is required');
    }

    // 3. Создаем AJASTER заявку
    await createAjasterRequest({
      title: requestToComplete.title,
      description: workDescription,
      equipmentId,
      masterId: user._id,
      usedConsumables: usedConsumables.map(uc => ({
        consumableId: uc.id,
        quantity: uc.quantity
      }))
    });

    // 4. Обновляем UI
    setRequests(prev => prev.filter(req => req._id !== requestToComplete._id));
    setRequestToComplete(null);
    
  } catch (err) {
    console.error('Error completing request:', err);
   
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
          className={`${styles.tabButton} ${activeTab === 'Completed' ? styles.active : ''}`}
          onClick={() => setActiveTab('Completed')}
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
                  <th>Заголовок</th>
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
                    <td>{request.title || '—'}</td>
                    <td>{request.createdAt ? formatDate(request.createdAt) : '—'}</td>
                    <td>
                      <button 
                        className={styles.detailsButton}
                        onClick={() => handleShowDetails(request)}
                      >
                        Подробнее
                      </button>
                      <button 
                        className={styles.completeButton}
                        onClick={() => handleInitiateComplete(request)}
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

      {activeTab === 'Completed' && (
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
                  <th>Заголовок</th>
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
                    <td>{request.title || '—'}</td>
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

      {/* Модальное окно деталей заявки */}
      {selectedRequest && (
        <RequestDetailsModal 
          request={selectedRequest} 
          onClose={() => setSelectedRequest(null)} 
        />
      )}
      
      {/* Модальное окно завершения заявки */}
      <CompleteRequestModal
        isOpen={!!requestToComplete}
        onClose={() => setRequestToComplete(null)}
        onComplete={handleCompleteWithDetails}
        consumables={consumables}
      />
    </div>
  );
};

export default RequestsPage;
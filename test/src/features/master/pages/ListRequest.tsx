import { useEffect, useState } from "react";
import { IRequest, IEquipment, IUser } from "../../../shared/types";
import { fetchRequests, deleteRequest } from "../api"; 
import { fetchEquipments } from "../../admin/api";
import { useDispatch } from 'react-redux';
import { logout } from "../../auth/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import styles from '../../../shared/styles/pages/request/listRequest.module.scss';

const ListRequest = () => {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<IRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [equipments, setEquipments] = useState<IEquipment[]>([]);
  const user = useSelector((state: RootState) => state.auth.user) as IUser | null;

  const loadEquipments = () => {
    if (!user || !user.workshop) return;
    
    fetchEquipments()
      .then((allEquipments) => {
        const filtered = allEquipments.filter(
          (eq) =>
            typeof eq.workshopId === 'string'
              ? eq.workshopId === user.workshop
              : eq.workshopId._id === (typeof user.workshop === 'string' ? user.workshop : user.workshop._id)
        );
        setEquipments(filtered);
      })
      .catch((err) => {
        console.error("Ошибка при получении оборудования:", err.response?.data || err.message);
        dispatch(logout());
      });
  };

  const loadRequests = () => {
    fetchRequests()
      .then((fetchedRequests) => {
        const masterRequests = user
          ? fetchedRequests.filter((req) => req.masterId === user._id)
          : [];
        setRequests(masterRequests);
        applyFilters(masterRequests, statusFilter, equipmentFilter);
      })
      .catch((err) => {
        console.error("Ошибка при получении заявок:", err.response?.data || err.message);
        dispatch(logout());
      });
  };

  const applyFilters = (requests: IRequest[], status: string, equipment: string) => {
    let filtered = [...requests];
    
    if (status !== 'all') {
      filtered = filtered.filter(r => r.status === status);
    }
    
    if (equipment !== 'all') {
      filtered = filtered.filter(r => {
        if (typeof r.equipmentId === 'string') {
          const eq = equipments.find(e => e._id === r.equipmentId);
          return eq?.name === equipment;
        } 
        else if (r.equipmentId && typeof r.equipmentId === 'object') {
          return (r.equipmentId as IEquipment).name === equipment;
        }
        return false;
      });
    }
    
    setFilteredRequests(filtered);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRequest(id);
      loadRequests();
    } catch (err) {
      console.error("Ошибка при удалении заявки:", err);
      alert("Не удалось удалить заявку");
    }
  };

  const getStats = () => {
    return {
      total: requests.length,
      inProgress: requests.filter(r => r.status === 'in-progress').length,
      completed: requests.filter(r => r.status === 'completed').length,
      pending: requests.filter(r => r.status === 'pending').length
    };
  };

  useEffect(() => {
    loadEquipments();
    loadRequests();
  }, []);

  useEffect(() => {
    applyFilters(requests, statusFilter, equipmentFilter);
  }, [statusFilter, equipmentFilter, requests, equipments]);

  const stats = getStats();

  const getEquipmentName = (equipmentId: string | IEquipment) => {
    if (typeof equipmentId === 'string') {
      const eq = equipments.find(e => e._id === equipmentId);
      return eq?.name || 'Неизвестно';
    }
    return equipmentId?.name || 'Неизвестно';
  };

  return (
    
    <div className={styles.viewRequestsSection}>
      <div className="fullWidth">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Мои заявки</h2>
          
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <select 
                id="filterStatus" 
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Все статусы</option>
                <option value="pending">Ожидание</option>
                <option value="in-progress">В работе</option>
                <option value="completed">Завершено</option>
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <select 
                id="filterEquipment" 
                className={styles.filterSelect}
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value)}
              >
                <option value="all">Все оборудование</option>
                {equipments.map((eq) => (
                  <option key={eq._id} value={eq.name}>
                    {eq.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <i className="fas fa-inbox"></i>
            </div>
            <div>
              <p className={styles.statLabel}>Всего заявок</p>
              <p className={styles.statValue}>{stats.total}</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <i className="fas fa-clock"></i>
            </div>
            <div>
              <p className={styles.statLabel}>Ожидание</p>
              <p className={styles.statValue}>{stats.pending}</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <i className="fas fa-tools"></i>
            </div>
            <div>
              <p className={styles.statLabel}>В работе</p>
              <p className={styles.statValue}>{stats.inProgress}</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <i className="fas fa-check-circle"></i>
            </div>
            <div>
              <p className={styles.statLabel}>Завершено</p>
              <p className={styles.statValue}>{stats.completed}</p>
            </div>
          </div>
        </div>
        
        <div className={styles.requestsList}>
          {filteredRequests.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-500">Заявки не найдены</p>
              {requests.length === 0 && (
                <button 
                  className={styles.createButton}
                  onClick={() => window.location.href = '/master/create-request'}
                >
                  <i className="fas fa-plus mr-2"></i>Создать первую заявку
                </button>
              )}
            </div>
          ) : (
            filteredRequests.map(request => (
              <div key={request._id} className={styles.requestCard}>
                <div className={styles.requestHeader}>
                  <div>
                    <h3 className={styles.requestTitle}>{request.title}</h3>
                    <div className={styles.requestMeta}>
                      <span className={`${styles.statusBadge} ${styles[request.status]}`}>
                        {request.status === 'Pending' ? 'Ожидание' : 
                        request.status === 'in-progress' ? 'В работе' : 'Завершено'}
                      </span>
                    </div>
                  </div>

                </div>
                
                <div className={styles.requestEquipment}>
                  <i className="fas fa-tag mr-1"></i> 
                  {getEquipmentName(request.equipmentId)}
                </div>
                
                <p className={styles.requestDescription}>
                  {request.description || 'Нет описания'}
                </p>
                
                <div className={styles.requestFooter}>
                  <span>ID: {request._id}</span>
                  <div className={styles.actions}>
                    <button 
                      className={styles.detailsButton}
                      onClick={() => {
                        alert(`Детали заявки #${request._id}\n\n` +
                              `Заголовок: ${request.title}\n` +
                              `Оборудование: ${getEquipmentName(request.equipmentId)}\n` +
                              `Статус: ${request.status === 'pending' ? 'Ожидание' : 
                                        request.status === 'in-progress' ? 'В работе' : 'Завершено'}\n` +
                              `Описание:\n${request.description || 'Нет описания'}`);
                      }}
                    >
                      <i className="fas fa-eye mr-1"></i> Подробнее
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => {
                        if (window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
                          handleDelete(request._id);
                        }
                      }}
                    >
                      <i className="fas fa-trash mr-1"></i> Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ListRequest;
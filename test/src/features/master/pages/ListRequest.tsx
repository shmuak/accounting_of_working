import { useEffect, useState } from "react";
import { IRequest, IEquipment, IUser } from "../../../shared/types";
import { fetchRequests, deleteRequest } from "../api";
import { fetchEquipments } from "../../admin/api";
import { useDispatch } from 'react-redux';
import { logout } from "../../auth/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import styles from '../../../shared/styles/pages/request/listRequest.module.scss';

// Вспомогательная функция для получения статуса на русском языке
const getStatusInRussian = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Ожидание';
    case 'approved':
      return 'Одобрено';
    case 'rejected':
      return 'Отклонено';
    default:
      return status; // Возвращаем исходный статус, если он неизвестен
  }
};

const ListRequest = () => {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<IRequest[]>([]);
  const [statusFilter, ] = useState('all');
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
        if (err.response?.status === 401 || err.response?.status === 403) {
            dispatch(logout());
        }
      });
  };

  const loadRequests = () => {
    fetchRequests()
      .then((fetchedRequests) => {
        const masterRequests = user
          ? fetchedRequests.filter((req) => req.masterId === user._id)
          : [];
        setRequests(masterRequests);
        // Применяем фильтры к загруженным заявкам
        // Передаем masterRequests вместо requests, так как setRequests асинхронный
        applyFilters(masterRequests, statusFilter, equipmentFilter);
      })
      .catch((err) => {
        console.error("Ошибка при получении заявок:", err.response?.data || err.message);
        if (err.response?.status === 401 || err.response?.status === 403) {
            dispatch(logout());
        }
      });
  };

  const applyFilters = (requestsToFilter: IRequest[], status: string, equipment: string) => {
    let filtered = [...requestsToFilter];

    if (status !== 'all') {
      // Убедитесь, что сравнение статусов корректно (например, 'Pending' === 'Pending')
      filtered = filtered.filter(r => r.status === status);
    }

    if (equipment !== 'all') {
      filtered = filtered.filter(r => {
        if (typeof r.equipmentId === 'string') {
          // Это условие может быть не нужно, если equipmentId всегда объект после populate
          // Оставим для случая, если r.equipmentId может быть просто ID
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
      loadRequests(); // Перезагружаем заявки после удаления
    } catch (err) {
      console.error("Ошибка при удалении заявки:", err);
      alert("Не удалось удалить заявку");
    }
  };

  useEffect(() => {
    loadEquipments();
    loadRequests();
  }, [user]); // Добавляем user в зависимости, если loadEquipments/loadRequests зависят от него

  useEffect(() => {
    // `requests` уже отфильтрованы по masterId в loadRequests
    applyFilters(requests, statusFilter, equipmentFilter);
  }, [statusFilter, equipmentFilter, requests, equipments]); // equipments тоже зависимость, если фильтр по оборудованию зависит от загруженных equipments

  const getEquipmentName = (equipmentId: string | IEquipment | undefined) => {
    if (!equipmentId) return 'Оборудование не указано';
    if (typeof equipmentId === 'string') {
      // Если это ID, ищем в загруженном списке оборудования
      const eq = equipments.find(e => e._id === equipmentId);
      return eq?.name || 'Неизвестное оборудование (ID)';
    }
    // Если это объект (популированные данные)
    return equipmentId?.name || 'Неизвестное оборудование';
  };

  return (
    <div className={styles.viewRequestsSection}>
      <div className="fullWidth">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Мои заявки</h2>
          
          <div className={styles.filters}>
            
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
        
        <div className={styles.requestsList}>
          {filteredRequests.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-500">Заявки не найдены</p>
              {/* Отображаем кнопку создания, если вообще нет заявок (не только отфильтрованных) */}
              {requests.length === 0 && ( 
                <button 
                  className={styles.createButton}
                  onClick={() => window.location.href = '/master/create-request'} // Лучше использовать Link из react-router-dom
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
                      {/* 
                        Используем getStatusInRussian для отображения.
                        Для стилей styles[request.status] убедитесь, что в вашем CSS-модуле 
                        есть классы .Pending, .Approved, .Rejected (с заглавной буквы) 
                        или используйте styles[request.status.toLowerCase()] если классы в lowercase.
                        Добавлен запасной класс styles.unknownStatus для непредвиденных статусов.
                      */}
                      <span className={`${styles.statusBadge} ${styles[request.status] || styles.unknownStatus}`}>
                        {getStatusInRussian(request.status)}
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
                              `Статус: ${getStatusInRussian(request.status)}\n` + // Используем хелпер
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
import { useEffect, useState } from "react";
import { IRequest, IEquipment, IUser } from "../../../shared/types";
import { fetchRequests, deleteRequest } from "../api"; 
import {fetchEquipments} from "../../admin/api"
import { useDispatch } from 'react-redux';
import { logout } from "../../auth/authSlice";
import styles from '../../../shared/styles/pages/request/listRequest.module.scss';
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

const ListRequest = () => {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [equipments, setEquipments] = useState<IEquipment[]>([]); // Состояние для хранения всех станков
  const user = useSelector((state: RootState) => state.auth.user) as IUser | null;

  // Загружаем все станки
  const loadEquipments = () => {
    fetchEquipments()
      .then(setEquipments)
      .catch((err) => {
        console.error("Ошибка при получении станков:", err.response?.data || err.message);
        dispatch(logout());
      });
  };

  // Загружаем заявки
  const loadRequests = () => {
    fetchRequests()
      .then((fetchedRequests) => {
        // Фильтруем заявки по id мастера
        console.log(user);
        const filteredRequests = user
          ? fetchedRequests.filter((req) => req.masterId === user._id)
          : [];
        setRequests(filteredRequests);
      })
      .catch((err) => {
        console.error("Ошибка при получении заявок:", err.response?.data || err.message);
        dispatch(logout());
      });
  };

  // Получение станка по ID из массива всех станков
  const getEquipmentById = (equipmentId: string): IEquipment | undefined => {
    return equipments.find(eq => eq._id === equipmentId);
  };

  // Удаление заявки
  const handleDelete = async (id: string) => {
    await deleteRequest(id);
    loadRequests();
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    loadRequests();
    loadEquipments(); // Загрузим все станки
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Список заявок</h1>

      <div className={styles.rowContainer}>
        {requests.map((req) => {
          // Получаем данные о станке для этой заявки
          const equipment = getEquipmentById(req.equipmentId as string); // Если это ID, ищем по ID

          return (
            <div key={req._id} className={styles.card}>
              <div className={styles.content}>
                <h2 className={styles.titleText}>{req.title}</h2>
                <p className={styles.status}>
                  <strong>Оборудование:</strong> {equipment ? equipment.name : 'Загрузка...'}
                </p>
                <p className={styles.status}>
                  <strong>Статус:</strong> {req.status}
                </p>
                <p className={styles.description}>
                  <strong>Описание:</strong> {req.description || 'Нет описания'}
                </p>
              </div>
              <div className={styles.actions}>
                <button onClick={() => handleDelete(req._id)} className={styles.deleteButton}>
                  Удалить
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListRequest;

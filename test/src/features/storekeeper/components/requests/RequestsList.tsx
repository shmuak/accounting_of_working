// src/components/requests/RequestsList.tsx
import { useEffect, useState } from 'react';
import RequestItem from './RequestsItem';
import styles from '../../../../shared/styles/pages/storekeeper/stokekeeperRequests.module.scss';
import { IConsumableRequest } from '../../../../shared/types'; // Импортируем IConsumableRequest
import { fetchRequests } from '../../api'; 



const RequestList = () => {
  const [requests, setRequests] = useState<IConsumableRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const loadRequests = async () => {
  setLoading(true);
  setError(null);
  try {
    const fetchedRequests = await fetchRequests();
    // Фильтруем заявки: исключаем "Выполнено" и "Отменено"
    const activeRequests = fetchedRequests.filter(
      req => !['Выполнено', 'Отменено'].includes(req.status)
    );
    console.log(activeRequests)
    setRequests(activeRequests);
  } catch (err) {
    console.error("Failed to fetch requests:", err);
    setError("Не удалось загрузить заявки. Пожалуйста, попробуйте позже.");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    loadRequests();
  }, []);
  // Загружаем заявки при монтировании компонента
  useEffect(() => {
    loadRequests();
  }, []); // Пустой массив зависимостей означает, что эффект выполнится только один раз при монтировании

  // Фильтруем заявки на основе выбранного статуса
  // Используем useMemo для мемоизации результата фильтрации
  


  // Отображение состояний загрузки и ошибки
  if (loading) {
    return <div className={styles.requestList}><p>Загрузка заявок...</p></div>;
  }

  if (error) {
    return <div className={styles.requestList}><p className={styles.errorMessage}>{error}</p></div>;
  }

  // Определяем заголовок списка в зависимости от фильтра

 console.log(requests)
  return (
    <div className={styles.requestList}>
      <div className={styles.listHeader}>
        {/* Отображаем актуальный заголовок и количество отфильтрованных заявок */}
        <h3 className={styles.listTitle}> ({requests.length})</h3>
      </div>
     
      <div className={styles.listContent}>
        {/* Проверяем, есть ли отфильтрованные заявки */}
        {requests.length > 0 ? (
          requests.map(request => (
            <RequestItem
              key={request._id} // Используем _id как ключ, он уникален
              request={request}
              onStatusUpdate={loadRequests} // Передаем функцию для обновления списка в RequestItem
            />
          ))
        ) : (
          // Сообщение, если заявок с таким статусом нет
          <p>Нет заявок с выбранным статусом.</p>
        )}
      </div>

      {/* Кнопка "Показать все заявки" теперь не нужна, т.к. есть фильтр */}
      {/* <div className={styles.listFooter}>
        <button className={styles.showAllButton}>
          Показать все заявки
        </button>
      </div> */}
    </div>
  );
};

export default RequestList;
// src/components/requests/RequestsItem.tsx
import { FaCheck, FaTimes } from 'react-icons/fa';
import styles from '../../../../shared/styles/pages/storekeeper/stokekeeperRequests.module.scss';
import { IConsumableRequest, IUser } from '../../../../shared/types'; // Импортируем IConsumableRequest и IUser
import { updateRequestStatus } from '../../api'; // Импортируем API функцию
import { useState } from 'react'; // Для управления состоянием кнопки

type RequestItemProps = {
  request: IConsumableRequest;
  // Добавляем callback, который будет вызван после успешного обновления статуса
  onStatusUpdate: () => void;
};

const RequestItem = ({ request, onStatusUpdate }: RequestItemProps) => {
  // Состояние для отключения кнопок во время отправки запроса
  const [isUpdating, setIsUpdating] = useState(false);

  // Обработчик для обновления статуса
  const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
    setIsUpdating(true);
    try {
      await updateRequestStatus(request._id, status);
      // Уведомляем родительский компонент о необходимости обновить список
      onStatusUpdate();
      // TODO: Показать пользователю уведомление об успехе (например, Toast)
    } catch (error) {
      console.error(`Failed to update request status for ${request._id}:`, error);
      // TODO: Показать пользователю уведомление об ошибке
    } finally {
      setIsUpdating(false);
    }
  };

  // Форматирование даты
  const formatRequestDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Простая проверка на валидность даты
      if (isNaN(date.getTime())) {
        return 'Неизвестная дата';
      }
       // Пример форматирования: "Сегодня, 10:45" или "23.11.2023, 10:45"
       const now = new Date();
       const isToday = date.getDate() === now.getDate() &&
                         date.getMonth() === now.getMonth() &&
                         date.getFullYear() === now.getFullYear();

       const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
       const time = date.toLocaleTimeString('ru-RU', timeOptions);

       if (isToday) {
           return `Сегодня, ${time}`;
       } else {
           const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
           const datePart = date.toLocaleDateString('ru-RU', dateOptions);
           return `${datePart}, ${time}`;
       }
    } catch (e) {
      console.error("Failed to format date:", dateString, e);
      return 'Неизвестная дата';
    }
  };

  // Проверяем, что masterId объект (если он был успешно популирован бэкендом)
  const masterLogin = typeof request.masterId === 'object' && request.masterId !== null
    ? (request.masterId as IUser).login
    : 'Загрузка...'; // Или 'Неизвестный', если population не сработал

  return (
    <div className={styles.requestItem}>
      <div className={styles.requestHeader}>
        <div>
          {/* Используем login из популированного masterId */}
          <p className={styles.requestUser}>{masterLogin}</p>
          {/* Используем createdAt из заявки */}
          <p className={styles.requestDate}>{formatRequestDate(request.createdAt)}</p>
        </div>
        {/* Используем статус из заявки */}
  
      </div>

      {/* Заявка кладовщику по вашей структуре содержит один item (name, quantity, unit) */}
      {/* Убираем старое поле description, т.к. его нет в IConsumableRequest */}
      {/* <p className={styles.requestDescription}>{request.description}</p> */}

      <div className={styles.requestItems}>
        {/* Отображаем данные по расходнику из самой заявки */}
        <div className={styles.requestItemRow}>
          <span className={styles.itemName}>{request.name}</span> {/* Имя расходника из заявки */}
          <span className={styles.itemQuantity}>{request.quantity} {request.unit}</span> {/* Количество и единица измерения из заявки */}
          {/* Можно добавить категорию: <span className={styles.itemCategory}>({request.category})</span> */}
        </div>
      </div>

   
        <div className={styles.requestActions}>
          <button
            className={styles.approveButton}
            onClick={() => handleUpdateStatus('approved')}
            disabled={isUpdating} // Отключаем кнопку во время обновления
          >
            <FaCheck />
            <span>Одобрить</span>
          </button>
          <button
            className={styles.rejectButton}
            onClick={() => handleUpdateStatus('rejected')}
            disabled={isUpdating} // Отключаем кнопку во время обновления
          >
            <FaTimes />
            <span>Отклонить</span>
          </button>
        </div>
      
      {/* Можно добавить кнопки для других статусов, например, 'Выполнено' для одобренных */}
      {/* {request.status === 'approved' && (
           <div className={styles.requestActions}>
               <button
                   className={styles.completeButton} // Нужен новый класс стиля
                   onClick={() => handleUpdateStatus('completed')} // Предполагается, что бэк поддерживает 'completed'
                   disabled={isUpdating}
               >
                   <FaCheck />
                   <span>Выполнено</span>
               </button>
           </div>
       )} */}

    </div>
  );
};

export default RequestItem;
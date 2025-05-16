// src/components/requests/RequestsItem.tsx
import { FaCheck, FaTimes, FaTruck, FaBoxOpen } from 'react-icons/fa';
import styles from '../../../../shared/styles/pages/storekeeper/stokekeeperRequests.module.scss';
import { IConsumableRequest, IUser } from '../../../../shared/types';
import { updateRequestStatus } from '../../api';
import { useState } from 'react';

type RequestItemProps = {
  request: IConsumableRequest;
  onStatusUpdate: () => void;
};

const RequestItem = ({ request, onStatusUpdate }: RequestItemProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (status: 'Принято' | 'Отменено' | 'Прибыло' | 'Выполнено') => {
    setIsUpdating(true);
    try {
      await updateRequestStatus(request._id, status);
      onStatusUpdate();
    } catch (error) {
      console.error(`Failed to update request status for ${request._id}:`, error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatRequestDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Неизвестная дата';
      }
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

  const masterLogin = typeof request.masterId === 'object' && request.masterId !== null
    ? (request.masterId as IUser).login
    : 'Загрузка...';

  return (
    <div className={styles.requestItem}>
      <div className={styles.requestHeader}>
        <div>
          <p className={styles.requestUser}>{masterLogin}</p>
          <p className={styles.requestDate}>{formatRequestDate(request.createdAt)}</p>
          <p className={styles.requestStatus}>Статус: {request.status}</p>
        </div>
      </div>

      <div className={styles.requestItems}>
        <div className={styles.requestItemRow}>
          <span className={styles.itemName}>{request.name}</span>
          <span className={styles.itemQuantity}>{request.quantity} {request.unit}</span>
        </div>
      </div>

      <div className={styles.requestActions}>
        {request.status === 'В обработке' && (
          <>
            <button
              className={styles.approveButton}
              onClick={() => handleUpdateStatus('Принято')}
              disabled={isUpdating}
            >
              <FaCheck />
              <span>Принять</span>
            </button>
            <button
              className={styles.rejectButton}
              onClick={() => handleUpdateStatus('Отменено')}
              disabled={isUpdating}
            >
              <FaTimes />
              <span>Отменить</span>
            </button>
          </>
        )}
        
        {request.status === 'Принято' && (
          <button
            className={styles.arrivedButton}
            onClick={() => handleUpdateStatus('Прибыло')}
            disabled={isUpdating}
          >
            <FaTruck />
            <span>Прибыло</span>
          </button>
        )}
        
        {request.status === 'Прибыло' && (
          <button
            className={styles.completeButton}
            onClick={() => handleUpdateStatus('Выполнено')}
            disabled={isUpdating}
          >
            <FaBoxOpen />
            <span>Выполнено</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default RequestItem;
import { IRequestMechanic } from '../../../shared/types';
import styles from '../../../shared/styles/pages/mechanic/mechanicRequests.module.scss';

interface RequestDetailsModalProps {
  request: IRequestMechanic;
  onClose: () => void;
}

const RequestDetailsModal = ({ request, onClose }: RequestDetailsModalProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Детали заявки #{request._id.slice(-4)}</h2>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Оборудование:</span>
          <span className={styles.detailValue}>
            {typeof request.equipmentId === 'object' 
              ? request.equipmentId.name 
              : 'Оборудование не найдено'}
          </span>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Заголовок:</span>
          <span className={styles.detailValue}>{request.title || '—'}</span>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Дата создания:</span>
          <span className={styles.detailValue}>
            {request.createdAt ? formatDate(request.createdAt) : '—'}
          </span>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Описание:</span>
          <span className={styles.detailValue}>
            {request.description || 'Описание отсутствует'}
          </span>
        </div>
        
        <div className={styles.modalButtons}>
          <button 
            className={styles.closeButton}
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
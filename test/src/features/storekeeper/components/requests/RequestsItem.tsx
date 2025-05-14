import { FaCheck, FaTimes } from 'react-icons/fa';
import styles from '../../../../shared/styles/pages/storekeeper/stokekeeperRequests.module.scss';


type RequestItemProps = {
  request: {
    id: number;
    user: string;
    date: string;
    description: string;
    status: 'new' | 'processing' | 'completed' | 'rejected';
    items: Array<{
      name: string;
      quantity: string;
    }>;
  };
};

const RequestItem = ({ request }: RequestItemProps) => {
  const statusClasses = {
    new: styles.statusNew,
    processing: styles.statusProcessing,
    completed: styles.statusCompleted,
    rejected: styles.statusRejected
  };
  
  return (
    <div className={styles.requestItem}>
      <div className={styles.requestHeader}>
        <div>
          <p className={styles.requestUser}>{request.user}</p>
          <p className={styles.requestDate}>{request.date}</p>
        </div>
        <span className={`${styles.requestStatus} ${statusClasses[request.status]}`}>
          {request.status === 'new' && 'Новая'}
          {request.status === 'processing' && 'В обработке'}
          {request.status === 'completed' && 'Выполнена'}
          {request.status === 'rejected' && 'Отклонена'}
        </span>
      </div>
      
      <p className={styles.requestDescription}>{request.description}</p>
      
      <div className={styles.requestItems}>
        {request.items.map((item, index) => (
          <div key={index} className={styles.requestItemRow}>
            <span className={styles.itemName}>{item.name}</span>
            <span className={styles.itemQuantity}>{item.quantity}</span>
          </div>
        ))}
      </div>
      
      {request.status === 'new' && (
        <div className={styles.requestActions}>
          <button className={styles.approveButton}>
            <FaCheck />
            <span>Одобрить</span>
          </button>
          <button className={styles.rejectButton}>
            <FaTimes />
            <span>Отклонить</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestItem;
import { useEffect, useState } from 'react';
import RequestItem from './RequestsItem';
import styles from '../../../../shared/styles/pages/storekeeper/stokekeeperRequests.module.scss';
import { IConsumableRequest } from '../../../../shared/types'; 
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
  useEffect(() => {
    loadRequests();
  }, []); 
  


  if (loading) {
    return <div className={styles.requestList}><p>Загрузка заявок...</p></div>;
  }

  if (error) {
    return <div className={styles.requestList}><p className={styles.errorMessage}>{error}</p></div>;
  }


 console.log(requests)
  return (
    <div className={styles.requestList}>
      <div className={styles.listHeader}>
        <h3 className={styles.listTitle}> ({requests.length})</h3>
      </div>
     
      <div className={styles.listContent}>
        {requests.length > 0 ? (
          requests.map(request => (
            <RequestItem
              key={request._id} 
              request={request}
              onStatusUpdate={loadRequests} 
            />
          ))
        ) : (
          <p>Нет заявок с выбранным статусом.</p>
        )}
      </div>


    </div>
  );
};

export default RequestList;
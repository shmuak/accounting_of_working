import RequestItem from './RequestsItem';
import styles from '../../../../shared/styles/pages/storekeeper/stokekeeperRequests.module.scss';
type RequestStatus = 'new' | 'processing' | 'completed' | 'rejected';
const RequestList = () => {
  const requests = [
    {
      id: 1,
      user: 'Иванов П.С.',
      date: 'Сегодня, 10:45',
      description: 'Требуется для ремонта двигателя Toyota Camry',
      status: 'new'  as RequestStatus,
      items: [
        { name: 'Подшипник 6205-2RSH', quantity: '2 шт' },
        { name: 'Масло моторное 5W-30', quantity: '5 л' }
      ]
    },
    {
      id: 2,
      user: 'Петров А.В.',
      date: 'Сегодня, 09:30',
      description: 'Для диагностики электроники BMW X5',
      status: 'new'  as RequestStatus,
      items: [
        { name: 'Датчик температуры', quantity: '1 шт' },
        { name: 'Разъем RJ45', quantity: '3 шт' }
      ]
    },
    {
      id: 3,
      user: 'Сидоров М.К.',
      date: 'Вчера, 16:20',
      description: 'Для планового ТО Volkswagen Golf',
      status: 'new'  as RequestStatus,
      items: [
        { name: 'Масло моторное 5W-30', quantity: '4 л' },
        { name: 'Воздушный фильтр', quantity: '1 шт' },
        { name: 'Свечи зажигания', quantity: '4 шт' }
      ]
    }
  ];

  return (
    <div className={styles.requestList}>
      <div className={styles.listHeader}>
        <h3 className={styles.listTitle}>Новые заявки</h3>
      </div>
      
      <div className={styles.listContent}>
        {requests.map(request => (
          <RequestItem key={request.id} request={request} />
        ))}
      </div>
      
      <div className={styles.listFooter}>
        <button className={styles.showAllButton}>
          Показать все заявки
        </button>
      </div>
    </div>
  );
};

export default RequestList;
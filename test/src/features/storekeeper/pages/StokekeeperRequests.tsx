import RequestList from '../components/requests/RequestsList';
import styles from '../../../shared/styles/pages/storekeeper/stokekeeperRequests.module.scss';

const RequestsPage = () => {
  return (
    <div className={styles.requestsPage}>
      <div className={styles.statsCard}>
        <h2 className={styles.statsTitle}>Заявки механиков</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Новые</span>
            <span className={styles.statValue}>3</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>В обработке</span>
            <span className={styles.statValue}>5</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Выполненные</span>
            <span className={styles.statValue}>12</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Отклоненные</span>
            <span className={styles.statValue}>2</span>
          </div>
        </div>
      </div>
      
      <div className={styles.filters}>
        <select className={styles.filterSelect}>
          <option>Все статусы</option>
          <option>Новые</option>
          <option>В обработке</option>
          <option>Выполненные</option>
          <option>Отклоненные</option>
        </select>
        <button className={styles.filterButton}>
          Применить
        </button>
      </div>
      
      <RequestList />
    </div>
  );
};

export default RequestsPage;
import RequestList from '../components/requests/RequestsList';
import styles from '../../../shared/styles/pages/storekeeper/stokekeeperRequests.module.scss';

const RequestsPage = () => {
  return (
    <div className={styles.requestsPage}>
      <RequestList />
    </div>
  );
};

export default RequestsPage;
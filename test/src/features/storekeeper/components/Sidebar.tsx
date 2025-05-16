import { NavLink } from 'react-router-dom';
import { 
  FaBoxes, 
  FaClipboardList, 
  FaChartLine, 
  FaSignOutAlt,
  FaWarehouse
} from 'react-icons/fa';
import styles from '../../../shared/styles/pages/Layout/stokekeeperLayout.module.scss';
import { IConsumableRequest } from '../../../shared/types';
import { useEffect, useState } from 'react';
import { fetchRequests } from '../api';

const Sidebar = () => {
    const [requests, setRequests] = useState<IConsumableRequest[]>([]);
  
    const loadRequests = async () => {
    try {
      const fetchedRequests = await fetchRequests();
      // Фильтруем только незавершенные заявки
      const activeRequests = fetchedRequests.filter(
        req => !['Выполнено', 'Отменено'].includes(req.status)
      );
      setRequests(activeRequests);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } 
  };

    useEffect(() => {
      loadRequests();
    }, []);
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <FaWarehouse />
        <span className={styles.logoText}>Склад</span>
      </div>
      
      <div className={styles.userInfo}>
        <div className={styles.avatar}>КЛ</div>
        <div className={styles.userDetails}>
          <p className={styles.userName}>Кладовщик</p>
        </div>
      </div>
      
      <nav className={styles.nav}>
        <NavLink to="/stokekeeper/inventory" className={styles.navItem}>
          <FaBoxes />
          <span>Инвентарь</span>
        </NavLink>
        <NavLink to="/stokekeeper/requests" className={styles.navItem}>
          <FaClipboardList />
          <span>Заявки</span>
          <span className={styles.badge}>{requests.length}</span>
        </NavLink>
        <NavLink to="/stokekeeper/reports" className={styles.navItem}>
          <FaChartLine />
          <span>Отчеты</span>
        </NavLink>
      </nav>
      
      <div className={styles.footer}>
        <button className={styles.logoutButton}>
          <FaSignOutAlt />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
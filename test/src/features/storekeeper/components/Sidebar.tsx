import { NavLink } from 'react-router-dom';
import { 
  FaBoxes, 
  FaClipboardList, 
  FaChartLine, 
  FaSignOutAlt,
  FaWarehouse
} from 'react-icons/fa';
import styles from '../../../shared/styles/pages/Layout/stokekeeperLayout.module.scss';

const Sidebar = () => {
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
          <span className={styles.badge}>3</span>
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
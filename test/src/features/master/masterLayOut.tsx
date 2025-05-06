import { Outlet, NavLink } from 'react-router-dom';
import { FaPlusCircle, FaList, FaSignOutAlt } from 'react-icons/fa';
import styles from '../../shared/styles/pages/Layout/masterLayout.module.scss';

const MasterLayout = () => {
  return (
    <div className={styles.container}>
      <nav className={styles.topNav}>
        <div className={styles.navContainer}>
          <div className={styles.navLeft}>
            <div className={styles.avatar}>М</div>
            <span className={styles.brand}>Мастер</span>
          </div>
          
          <div className={styles.navCenter}>
            <NavLink 
              to="/master/create-request" 
              className={({ isActive }) => 
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <FaPlusCircle className={styles.navIcon} />
              Создать заявку
            </NavLink>
            <NavLink 
              to="/master/requests" 
              className={({ isActive }) => 
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <FaList className={styles.navIcon} />
              Мои заявки
            </NavLink>
          </div>
          
          <div className={styles.navRight}>
            
            <NavLink 
              to="/auth/login" 
              className={styles.navItem}
              title="Выход"
            >
              <FaSignOutAlt className={styles.navIcon} />
            </NavLink>
          </div>
        </div>
      </nav>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default MasterLayout;
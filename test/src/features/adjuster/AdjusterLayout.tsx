import { Outlet, NavLink } from 'react-router-dom';
import { 
  FaInbox,
  FaCheckCircle,
  FaTools,
  FaBell,

} from 'react-icons/fa';
import { IoMdExit } from "react-icons/io";
import styles from './adjusterLayout.module.scss';
// import { IUser } from '../../shared/types';
// import { RootState } from '../../store';
// import { useSelector } from 'react-redux';

const AdjusterLayout = () => {
//   const user = useSelector((state: RootState) => state.auth.user) as IUser | null;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <FaTools />
            <span>Наладчик</span>
          </div>
        </div>
        
        <nav className={styles.navigation}>
          <ul>
            <li>
              <NavLink to="/adjuster/requests" title="Новые заявки">
                <FaInbox />
                <span>Заявки</span>
                <span className={styles.badge}>3</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/adjuster/completed" title="Выполненные">
                <FaCheckCircle />
                <span>Выполненные</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className={styles.userPanel}>
          <div className={styles.userInfo}>
            <div>
              <span className={styles.userName}>Иванов П.С.</span>
              <span className={styles.userRole}>Наладчик 3 разряда</span>
            </div>
          </div>
          <NavLink to="/logout" title="Выход" className={styles.logout}>
            <IoMdExit />
          </NavLink>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Новые заявки</h1>
          <div className={styles.headerActions}>
            <button className={styles.notificationButton}>
              <FaBell />
            </button>
            <div className={styles.userMenu}>
              <span className={styles.userNameShort}>Иванов П.С.</span>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdjusterLayout;
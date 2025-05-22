// src/layouts/AdjusterLayout.tsx
import { Outlet, NavLink } from 'react-router-dom';
import { 
  FaInbox, 
  FaCheckCircle,
  FaTools
} from 'react-icons/fa';
import styles from '../../shared/styles/pages/Layout/adjuster.module.scss';
import { IUser } from '../../shared/types';
import { RootState } from '../../store';  
import { useSelector } from 'react-redux';
import { IoMdExit } from 'react-icons/io';

const AdjusterLayout = () => {
  const user = useSelector((state: RootState) => state.auth.user) as IUser | null;

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
                <span>Новые заявки</span>
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
            <div className={styles.userDetails}>
              <div className={styles.userAvatar}>
                {user?.login?.charAt(0).toUpperCase()}
              </div>
              <div className={styles.userText}>
                <div className={styles.userName}>{user?.login}</div>
                <div className={styles.userRole}>Наладчик</div>
              </div>
            </div>
            <NavLink 
              to="/logout" 
              title="Выход" 
              className={styles.logout}
            >
              <IoMdExit />
            </NavLink>
          </div>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.topNavigation}>


        </div>
        
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdjusterLayout;
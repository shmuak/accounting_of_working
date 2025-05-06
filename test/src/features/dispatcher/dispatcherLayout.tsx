import { Outlet, NavLink } from 'react-router-dom';
import { 
  FaClipboardList, 
  FaUsers, 
  FaCalendarAlt, 
  FaChartPie, 
  FaTools
} from 'react-icons/fa';
import { IoMdExit } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import styles from '../../shared/styles/pages/Layout/dispatcherLayout.module.scss';
import { IUser } from '../../shared/types';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

const DispatcherLayout = () => {
  const user = useSelector((state: RootState) => state.auth.user) as IUser | null;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <FaTools />
            <span>Диспетчер</span>
          </div>
        </div>
        
        <nav className={styles.navigation}>
          <ul>
            <li>
              <NavLink to="/dispatcher/requests" title="Заявки">
                <FaClipboardList />
                <span>Заявки</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dispatcher/mechanics" title="Слесари">
                <FaUsers />
                <span>Слесари</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dispatcher/schedule" title="Графики">
                <FaCalendarAlt />
                <span>Графики</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dispatcher/reports" title="Отчеты">
                <FaChartPie />
                <span>Отчеты</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className={styles.userPanel}>
          <div className={styles.userInfo}>
            <BiUser />
            <div>
              <span className={styles.userName}>{user?.login}</span>
              <span className={styles.userRole}>{user?.role}</span>
            </div>
          </div>
          <NavLink to="/logout" title="Выход" className={styles.logout}>
            <IoMdExit />
          </NavLink>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Панель управления</h1>
        </header>
        
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DispatcherLayout;
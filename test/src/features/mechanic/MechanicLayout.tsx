import { Outlet, NavLink } from 'react-router-dom';
import { 
  FaClipboardList, 
  FaWarehouse, 
  FaShoppingCart,
  FaTools
} from 'react-icons/fa';
import { IoMdExit } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import styles from '../../shared/styles/pages/Layout/mechanicLayout.module.scss';
import { IUser } from '../../shared/types';
import { RootState } from '../../store';  
import { useSelector } from 'react-redux';

const MechanicLayout = () => {
  const user = useSelector((state: RootState) => state.auth.user) as IUser | null;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <FaTools />
            <span>Слесарь</span>
          </div>
        </div>
        
        <nav className={styles.navigation}>
          <ul>
            <li>
              <NavLink to="/mechanic/requests" title="Мои заявки">
                <FaClipboardList />
                <span>Мои заявки</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/mechanic/warehouse" title="Склад">
                <FaWarehouse />
                <span>Склад</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/mechanic/request-warehouse" title="Заявки на закупку">
                <FaShoppingCart />
                <span>Заявки на закупку</span>
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
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MechanicLayout;
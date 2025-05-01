import { Outlet, NavLink } from 'react-router-dom';
import { VscRequestChanges } from "react-icons/vsc";
import { IoMdExit } from "react-icons/io";
import styles from '../../shared/styles/pages/Layout/masterLayout.module.scss';
console.log('MasterLayout рендерится');
const MasterLayout = () => {
  return (
    
    <div className={styles.container}>
      <aside className={styles.toolbar}>
        <nav>
          <ul>
            <li>
              <NavLink to="/master/create-request" title="Создать заявку">
                <VscRequestChanges />
              </NavLink>
            </li>
            <li>
              <NavLink to="/auth/login" title="Выход">
                <IoMdExit />
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default MasterLayout;

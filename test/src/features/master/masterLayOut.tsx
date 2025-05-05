import { Outlet, NavLink } from 'react-router-dom';
import { VscRequestChanges } from "react-icons/vsc";
import { IoMdExit } from "react-icons/io";
import { GrDocumentText } from "react-icons/gr";

import styles from '../../shared/styles/pages/Layout/masterLayout.module.scss';
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
              <NavLink to="/master/requests" title='Список заявок'>
              <GrDocumentText />
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

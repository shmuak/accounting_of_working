import { Outlet, NavLink } from 'react-router-dom'
import { FaUsers, FaUserPlus, FaTools, FaToolbox } from 'react-icons/fa'
import { BiBuilding, BiBuildings, BiUser } from "react-icons/bi";
import { IoMdExit } from "react-icons/io";
import styles from '../../shared/styles/pages/Layout/adminLayout.module.scss'
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { IUser } from '../../shared/types';

const AdminLayout = () => {
  const user = useSelector((state: RootState) => state.auth.user) as IUser | null;

  return (
    <div className={styles.container}>
      <aside className={styles.toolbar}>
        <nav>
          <ul>
            <li>
              <NavLink to="/admin/users" title="Пользователи">
                <FaUsers />
                <span>Пользователи</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users/add" title="Добавить пользователя">
                <FaUserPlus />
                <span>Добавить</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/workshops" title="Цеха">
                <BiBuilding />
                <span>Цеха</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/workshops/add" title="Добавить цех">
                <BiBuildings />
                <span>Добавить цех</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/equipments/add" title="Добавить оборудование">
                <FaTools />
                <span>Добавить</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/equipments" title="Оборудование">
                <FaToolbox />
                <span>Оборудование</span>
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
            <span>Выход</span>
          </NavLink>
        </div>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
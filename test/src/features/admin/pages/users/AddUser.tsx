import { useEffect, useState } from "react";
import { createUser, fetchRoles, fetchWorkshops } from "../../api";
import { IRole, IWorkshop } from "../../../../shared/types";
import styles from '../../../../shared/styles/pages/user/addUser.module.scss';

const AddUser = () => {
  const [newUser, setNewUser] = useState({
    login: '',
    password: '',
    role: '',
    workshop: ''
  });

  const [roles, setRoles] = useState<IRole[]>([]);
  const [workshops, setWorkshops] = useState<IWorkshop[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRoles().then(setRoles);
    fetchWorkshops().then(setWorkshops);
    if (newUser.role === 'ADMIN') {
      setNewUser(prev => ({ ...prev, workshop: '' }));
    }
  }, []);

  const handleCreate = async () => {
    if (!newUser.login || !newUser.password || !newUser.role || (newUser.role !== 'ADMIN' && newUser.role !== 'DISPATCHER' && !newUser.workshop)) {
      alert('Заполните все поля');
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedUser = {
        login: newUser.login,
        password: newUser.password,
        role: newUser.role,
        workshop: newUser.workshop 
      };

      await createUser(formattedUser);
      setNewUser({ login: '', password: '', role: '', workshop: '' });
      alert('Пользователь успешно создан!');
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
      alert('Произошла ошибка при создании пользователя');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formCard}>
        <h1>Создать нового пользователя</h1>
        
        <div className={styles.formGroup}>
          <label htmlFor="role">Роль</label>
          <select
            id="role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className={styles.formSelect}
          >
            <option value="" disabled>Выберите роль</option>
            {roles.map(role => (
              <option key={role._id} value={role.value}>
                {role.value}
              </option>
            ))}
          </select>
        </div>

        {newUser.role && newUser.role !== 'ADMIN' && newUser.role !== 'DISPATCHER' && (
          <div className={styles.formGroup}>
            <label htmlFor="workshop">Цех</label>
            <select
              id="workshop"
              value={newUser.workshop}
              onChange={(e) => setNewUser({ ...newUser, workshop: e.target.value })}
              className={styles.formSelect}
            >
              <option value="" disabled>Выберите цех</option>
              {workshops.map(workshop => (
                <option key={workshop._id} value={workshop._id}>
                  {workshop.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="login">Логин</label>
          <input
            id="login"
            type="text"
            placeholder="Введите логин"
            value={newUser.login}
            onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            placeholder="Введите пароль"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className={styles.formInput}
          />
        </div>

        <button 
          onClick={handleCreate} 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Создание...' : 'Создать пользователя'}
        </button>
      </div>
    </div>
  );
};

export default AddUser;
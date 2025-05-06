import LoginForm from '../components/LoginForm/LoginForm';
import styles from '../../../shared/styles/pages/login/login.module.scss';

const Login = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h1>УЧЕТ РЕМОНТНЫХ РАБОТ</h1>
          <p>Система управления ремонтными работами предприятия</p>
        </div>
        <div className={styles.formSection}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginRequest } from '../../api'
import { useNavigate } from 'react-router-dom'
import { AppDispatch } from '../../../../app/store'
import styles from '../../../../shared/styles/components/FormAuth/formAuth.module.scss'
import { loginSuccess } from '../../authSlice'
const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [form, setForm] = useState({ login: '', password: '' })

  const roleRouteMap: Record<string, string> = {
    ADMIN: '/admin/users',
    MASTER: '/master/create-request',
    DISPATCHER: '/dispatcher',
    MECHANIC: '/mechanic',
    STOKEKEEPER: '/stokekeeper',
    ADJUSTER: '/adjuster',
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token, user } = await loginRequest(form.login, form.password);
      dispatch(loginSuccess({ token, user }));
  
      const role = user.role.toUpperCase();
      const route = roleRouteMap[role] || '/';
      navigate(route);
    } catch (e) {
      alert('Неверный логин или пароль');
      console.log(e);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.form__wrapper}>
        <input
          name="login"
          placeholder="Login"
          onChange={handleChange}
          className={styles.form__input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className={styles.form__input}
        />
        <button type="submit" className={styles.form__button}>
          Войти
        </button>
      </div>
    </form>
  )
}

export default LoginForm

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginRequest } from '../../api'
import { loginSuccess } from '../../authSlice'
import { useNavigate } from 'react-router-dom'
import { AppDispatch } from '../../../../app/store'
import {jwtDecode} from 'jwt-decode'
import {ITokenPayload} from '../../../../shared/types/index'
import styles from '../../../../shared/styles/components/FormAuth/formAuth.module.scss'
const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [form, setForm] = useState({ login: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { token } = await loginRequest(form.login, form.password)
      const decoded = jwtDecode<ITokenPayload>(token)
      dispatch(loginSuccess({ token, role: decoded.role }))
      navigate('/admin/users')
    } catch (e) {
      alert('Неверный логин или пароль')
      console.log(e);
    }
  }

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

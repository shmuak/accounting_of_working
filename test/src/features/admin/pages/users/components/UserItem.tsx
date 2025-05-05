import { IUser } from '../../../../../shared/types'
import styles from '../../../../../shared/styles/components/UserItem/UserItem.module.scss'

interface Props {
  user: IUser
  onEdit: () => void
  onDelete: () => void
}

const UserItem = ({ user, onEdit, onDelete }: Props) => {
  return (
    <li className={styles.item}>
      <div className={styles.userInfo}>
        <span className={styles.userId}>{user._id}</span>
        <span className={styles.userLogin}>{user.login}</span>
        <span className={styles.userRole}>{user.role || 'Нет роли'}</span>
        <span className={styles.userRole}>
          {typeof user.workshop === 'object' && 'name' in user.workshop
            ? user.workshop.name
            : 'Не указан'}
        </span>
      </div>
      <div className={styles.actions}>
        <button className={styles.editButton} onClick={onEdit}>
          Редактировать
        </button>
        <button className={styles.deleteButton} onClick={onDelete}>
          Удалить
        </button>
      </div>
    </li>
  )
}

export default UserItem

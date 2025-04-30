import { ChangeEvent } from 'react'
import styles from '../../../../shared/styles/components/searchUsers/searchUsers.module.scss'
interface UserSearchProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
}

const UserSearch = ({ searchTerm, setSearchTerm }: UserSearchProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <input
        type="text"
        placeholder="Поиск"
        value={searchTerm}
        onChange={handleChange}
        className={styles.searchInput}
    />
  )
}

export default UserSearch

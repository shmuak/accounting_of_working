import { FaBars,  FaSearch } from 'react-icons/fa';
import styles from '../../../shared/styles/pages/Layout/stokekeeperLayout.module.scss';

const Topbar = () => {
  return (
    <header className={styles.topbar}>
      <div className={styles.topSection}>
        <div className={styles.leftSection}>
          <button className={styles.menuButton}>
            <FaBars />
          </button>
          <h1 className={styles.title}>Учет инвентаря</h1>
        </div>
      
        
      </div>
      
      <div className={styles.bottomSection}>

        <div className={styles.search}>
          <FaSearch className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Поиск..." 
            className={styles.searchInput}
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
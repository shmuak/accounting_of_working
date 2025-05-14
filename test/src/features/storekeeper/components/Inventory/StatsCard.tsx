import { FaBoxes, FaExclamationTriangle, FaClipboardList } from 'react-icons/fa';
import styles from '../../../../shared/styles/pages/storekeeper/inventory.module.scss';

type StatsCardProps = {
  title: string;
  value: string;
  icon: 'boxes' | 'warning' | 'clipboard';
  color: 'blue' | 'red' | 'yellow' | 'green';
};

const StatsCard = ({ title, value, icon, color }: StatsCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'boxes': return <FaBoxes />;
      case 'warning': return <FaExclamationTriangle />;
      case 'clipboard': return <FaClipboardList />;
      default: return <FaBoxes />;
    }
  };
  
  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-800' },
    red: { bg: 'bg-red-100', text: 'text-red-800' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    green: { bg: 'bg-green-100', text: 'text-green-800' },
  };
  
  return (
    <div className={styles.statsCard}>
      <div className={styles.statsContent}>
        <div>
          <p className={styles.statsTitle}>{title}</p>
          <p className={styles.statsValue}>{value}</p>
        </div>
        <div className={`${styles.statsIcon} ${colorClasses[color].bg} ${colorClasses[color].text}`}>
          {getIcon()}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
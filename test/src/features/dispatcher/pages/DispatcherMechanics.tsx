import styles from '../../../shared/styles/pages/dispatcher/DispatcherMechanics.module.scss';

const DispatcherMechanics = () => {
  const mechanics = [
    {
      id: 1,
      name: 'Алексей Смирнов',
      position: 'Слесарь 5 разряда',
      workload: 65,
      currentTasks: 3,
      completedThisMonth: 12,
      avgTime: '4ч 20м',
      image: 'https://via.placeholder.com/60'
    },
    {
      id: 2,
      name: 'Дмитрий Иванов',
      position: 'Слесарь 4 разряда',
      workload: 45,
      currentTasks: 2,
      completedThisMonth: 8,
      avgTime: '5ч 10м',
      image: 'https://via.placeholder.com/60'
    },
    {
      id: 3,
      name: 'Сергей Кузнецов',
      position: 'Слесарь 6 разряда',
      workload: 80,
      currentTasks: 5,
      completedThisMonth: 18,
      avgTime: '3ч 45м',
      image: 'https://via.placeholder.com/60'
    }
  ];

  return (
    <div className={styles.mechanics}>
      <div className={styles.header}>
        <h2>Управление слесарями</h2>
        <button className={styles.primaryButton}>
          <i className="fas fa-user-plus"></i> Добавить слесаря
        </button>
      </div>

      <div className={styles.mechanicsGrid}>
        {mechanics.map(mechanic => (
          <div key={mechanic.id} className={styles.mechanicCard}>
            <div className={styles.mechanicHeader}>
              <img src={mechanic.image} alt={mechanic.name} className={styles.mechanicImage} />
              <div>
                <h3 className={styles.mechanicName}>{mechanic.name}</h3>
                <p className={styles.mechanicPosition}>{mechanic.position}</p>
              </div>
            </div>

            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>Загрузка</span>
                <span>{mechanic.workload}%</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${mechanic.workload}%` }}
                ></div>
              </div>
            </div>

            <div className={styles.mechanicStats}>
              <div className={styles.statItem}>
                <span>Текущих задач:</span>
                <span>{mechanic.currentTasks}</span>
              </div>
              <div className={styles.statItem}>
                <span>Выполнено за месяц:</span>
                <span>{mechanic.completedThisMonth}</span>
              </div>
              <div className={styles.statItem}>
                <span>Среднее время:</span>
                <span>{mechanic.avgTime}</span>
              </div>
            </div>

            <div className={styles.mechanicActions}>
              <button className={styles.assignButton}>
                Назначить задачу
              </button>
              <button className={styles.moreButton}>
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DispatcherMechanics;
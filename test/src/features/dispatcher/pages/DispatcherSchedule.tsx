import { useState } from 'react';
import WorkloadChart from '../components/WorkloadChart';
import styles from '../../../shared/styles/pages/dispatcher/DispatcherSchedule.module.scss';

interface ScheduleItem {
  mechanic: string;
  days: (string[] | string)[];
}

interface WorkloadData {
  mechanic: string;
  plannedHours: number;
  unplannedHours: number;
  totalHours: number;
  capacity: number;
}

const DispatcherSchedule = () => {
  const [currentWeek] = useState('12-18 июня 2023');

  // Данные для таблицы расписания
  const scheduleData: ScheduleItem[] = [
    {
      mechanic: 'Алексей Смирнов',
      days: [
        ['#124 (8:00-12:00)', '#118 (13:00-17:00)'],
        ['#121 (8:00-16:00)'],
        ['#115 (8:00-12:00)'],
        'Отпуск',
        'Отпуск',
        [],
        []
      ]
    },
    {
      mechanic: 'Дмитрий Иванов',
      days: [
        ['#120 (8:00-10:00)', '#119 (11:00-17:00)'],
        ['#117 (8:00-12:00)'],
        [],
        ['#125 (8:00-16:00)'],
        ['#116 (8:00-12:00)'],
        [],
        []
      ]
    },
    {
      mechanic: 'Сергей Кузнецов',
      days: [
        ['#123 (8:00-12:00)'],
        ['#114 (8:00-16:00)'],
        ['#113 (8:00-12:00)'],
        ['#112 (8:00-16:00)'],
        ['#111 (8:00-12:00)'],
        [],
        []
      ]
    }
  ];

  // Цвета для задач
  const dayColors: Record<string, string> = {
    '#124': 'blue',
    '#118': 'green',
    '#121': 'yellow',
    '#115': 'purple',
    '#120': 'red',
    '#119': 'blue',
    '#117': 'green',
    '#125': 'yellow',
    '#116': 'purple',
    '#123': 'blue',
    '#114': 'green',
    '#113': 'yellow',
    '#112': 'purple',
    '#111': 'red',
    'Отпуск': 'gray'
  };

  // Расчет данных для графика загрузки
  const calculateWorkload = (): WorkloadData[] => {
    return scheduleData.map(mechanic => {
      // Подсчет плановых часов (из расписания)
      const plannedHours = mechanic.days
        .flat()
        .filter(task => typeof task === 'string' && !task.includes('Отпуск'))
        .length * 4; // Примерный расчет - 4 часа на задачу

      // Неплановые часы (можно получать из API заявок)
      const unplannedHours = Math.floor(Math.random() * 15) + 5; // Примерные данные

      const totalHours = plannedHours + unplannedHours;
      const capacity = 40; // Норма часов в неделю

      return {
        mechanic: mechanic.mechanic,
        plannedHours,
        unplannedHours,
        totalHours,
        capacity
      };
    });
  };

  const workloadData = calculateWorkload();

  // Расчет общей статистики
  const totalStats = {
    planned: workloadData.reduce((sum, item) => sum + item.plannedHours, 0),
    unplanned: workloadData.reduce((sum, item) => sum + item.unplannedHours, 0),
    total: workloadData.reduce((sum, item) => sum + item.totalHours, 0),
    capacity: workloadData.reduce((sum, item) => sum + item.capacity, 0)
  };

  return (
    <div className={styles.schedule}>
      <div className={styles.header}>
        <h2>Графики работы слесарей</h2>
        <div className={styles.actions}>
          <button className={styles.secondaryButton}>
            <i className="fas fa-calendar"></i> Неделя
          </button>
          <button className={styles.primaryButton}>
            <i className="fas fa-print"></i> Печать
          </button>
        </div>
      </div>

      <div className={styles.scheduleTable}>
        <div className={styles.tableHeader}>
          <h3>Расписание на неделю {currentWeek}</h3>
          <div className={styles.weekNavigation}>
            <button className={styles.navButton}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className={styles.navButton}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Слесарь</th>
              <th>Пн 12</th>
              <th>Вт 13</th>
              <th>Ср 14</th>
              <th>Чт 15</th>
              <th>Пт 16</th>
              <th>Сб 17</th>
              <th>Вс 18</th>
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((row, index) => (
              <tr key={index}>
                <td className={styles.mechanicName}>{row.mechanic}</td>
                {row.days.map((tasks, dayIndex) => (
                  <td key={dayIndex}>
                    {Array.isArray(tasks) ? (
                      tasks.map((task, taskIndex) => {
                        const taskId = task.split(' ')[0];
                        const color = dayColors[taskId] || 'gray';
                        return (
                          <div 
                            key={taskIndex} 
                            className={`${styles.taskBadge} ${styles[color]}`}
                          >
                            {task}
                          </div>
                        );
                      })
                    ) : (
                      <div className={`${styles.taskBadge} ${styles[dayColors[tasks]]}`}>
                        {tasks}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.workloadStats}>
        <div className={styles.statsHeader}>
          <h3>Статистика загрузки</h3>
          <div className={styles.timePeriod}>
            <span>Неделя {currentWeek}</span>
          </div>
        </div>
        
        <div className={styles.chartContainer}>
          <WorkloadChart data={workloadData} />
        </div>
        
        <div className={styles.statsSummary}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Общая загрузка:</span>
            <span className={styles.statValue}>
              {Math.round((totalStats.total / totalStats.capacity) * 100)}%
            </span>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${Math.round((totalStats.total / totalStats.capacity) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Плановые работы:</span>
            <span className={styles.statValue}>{totalStats.planned} ч</span>
          </div>
          
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Неплановые работы:</span>
            <span className={styles.statValue}>{totalStats.unplanned} ч</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatcherSchedule;
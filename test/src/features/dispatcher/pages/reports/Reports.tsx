import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import styles from '../../../../shared/styles/pages/dispatcher/reports.module.scss';

const Reports: React.FC = () => {
  const requestsChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (requestsChartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = requestsChartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['1 июн', '5 июн', '10 июн', '15 июн', '20 июн', '25 июн', '30 июн'],
            datasets: [
              {
                label: 'Новые',
                data: [3, 5, 2, 4, 6, 3, 2],
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3,
                fill: true
              },
              {
                label: 'В работе',
                data: [2, 3, 4, 3, 2, 4, 3],
                borderColor: 'rgba(252, 211, 77, 1)',
                backgroundColor: 'rgba(252, 211, 77, 0.1)',
                tension: 0.3,
                fill: true
              },
              {
                label: 'Завершено',
                data: [4, 5, 3, 6, 4, 7, 5],
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.3,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }

    // Cleanup function to destroy chart when component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className={styles.reports}>
      <div className={styles.header}>
        <h2 className={styles.title}>Отчеты по заявкам</h2>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.primary}`}>
            <i className="fas fa-file-export"></i> Экспорт
          </button>
          <button className={`${styles.btn} ${styles.secondary}`}>
            <i className="fas fa-filter"></i> Фильтр
          </button>
        </div>
      </div>

      <div className={styles.reportContent}>
        <div className={styles.reportParams}>
          <h3 className={styles.subtitle}>Параметры отчета</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Период</label>
            <select className={styles.formControl} defaultValue="Последний месяц">
              <option value="Последняя неделя">Последняя неделя</option>
              <option value="Последний месяц">Последний месяц</option>
              <option value="Последний квартал">Последний квартал</option>
              <option value="Последний год">Последний год</option>
              <option value="Произвольный период">Произвольный период</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Цех</label>
            <select className={styles.formControl} defaultValue="Все цеха">
              <option value="Все цеха">Все цеха</option>
              <option value="Литейный цех">Литейный цех</option>
              <option value="Механический цех">Механический цех</option>
              <option value="Сборочный цех">Сборочный цех</option>
              <option value="Склад">Склад</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Слесарь</label>
            <select className={styles.formControl} defaultValue="Все слесари">
              <option value="Все слесари">Все слесари</option>
              <option value="Алексей Смирнов">Алексей Смирнов</option>
              <option value="Дмитрий Иванов">Дмитрий Иванов</option>
              <option value="Сергей Кузнецов">Сергей Кузнецов</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Статус</label>
            <select className={styles.formControl} defaultValue="Все статусы">
              <option value="Все статусы">Все статусы</option>
              <option value="Новые">Новые</option>
              <option value="В работе">В работе</option>
              <option value="Завершено">Завершено</option>
              <option value="Отклонено">Отклонено</option>
            </select>
          </div>

          <button className={`${styles.btn} ${styles.primary} ${styles.fullWidth}`}>
            Сформировать отчет
          </button>
        </div>

        <div className={styles.reportResults}>
          <h3 className={styles.subtitle}>Статистика за последний месяц</h3>
          
          <div className={styles.chartContainer}>
            <canvas ref={requestsChartRef} height="200"></canvas>
          </div>

          <div className={styles.statsTable}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Показатель</th>
                  <th>Значение</th>
                  <th>Изменение</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Всего заявок</td>
                  <td>47</td>
                  <td className={styles.success}>
                    <i className="fas fa-arrow-up"></i> 12%
                  </td>
                </tr>
                <tr>
                  <td>Среднее время выполнения</td>
                  <td>4ч 35м</td>
                  <td className={styles.danger}>
                    <i className="fas fa-arrow-down"></i> 8%
                  </td>
                </tr>
                <tr>
                  <td>Завершено в срок</td>
                  <td>39 (83%)</td>
                  <td className={styles.success}>
                    <i className="fas fa-arrow-up"></i> 5%
                  </td>
                </tr>
                <tr>
                  <td>Отклонено заявок</td>
                  <td>3 (6%)</td>
                  <td className={styles.danger}>
                    <i className="fas fa-arrow-up"></i> 2%
                  </td>
                </tr>
                <tr>
                  <td>Средняя оценка качества</td>
                  <td>4.7 / 5</td>
                  <td className={styles.success}>
                    <i className="fas fa-arrow-up"></i> 0.2
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
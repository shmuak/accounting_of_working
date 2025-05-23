import React, { useState, useEffect, useRef } from 'react';
import { FaBoxes, FaClipboardList, FaFileExport, FaUserCog } from 'react-icons/fa';
import { format, subDays } from 'date-fns';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import styles from '../../../shared/styles/pages/storekeeper/stokekeeperReports.module.scss';
import { IUser, IConsumableRequest } from '../../../shared/types';
import $api from '../../../shared/api/axios';
import { fetchUsersForStorekeeper } from '../api';

interface MechanicStats {
  id: string;
  name: string;
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  completedRequests: number;
  cancelledRequests: number;
  totalItems: number;
}

const ReportsPage = () => {
  const [mechanics, setMechanics] = useState<IUser[]>([]);
  const [requests, setRequests] = useState<IConsumableRequest[]>([]);
  const [, setStats] = useState<MechanicStats[]>([]);
  const [filteredStats, setFilteredStats] = useState<MechanicStats[]>([]);
  const [timeRange, setTimeRange] = useState<string>('Последний месяц');
  const [selectedMechanic, setSelectedMechanic] = useState<string>('Все механики');
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const reportResultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mechanicsData, requestsData] = await Promise.all([
          fetchUsersForStorekeeper(),
          fetchRequests()
        ]);

        const mechanics = mechanicsData.filter(user => user.role === 'MECHANIC');
        console.log('Filtered mechanics:', mechanics);
        setMechanics(mechanics);
        setRequests(requestsData);
        
        const calculatedStats = calculateMechanicsStats(mechanics, requestsData);
        setStats(calculatedStats);
        setFilteredStats(calculatedStats);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchRequests = async (): Promise<IConsumableRequest[]> => {
    try {
      const response = await $api.get('/stokekeeper/requests');
      return response.data.requests || [];
    } catch (error) {
      console.error("Error fetching requests:", error);
      return [];
    }
  };

  const calculateMechanicsStats = (mechanics: IUser[], requests: IConsumableRequest[]): MechanicStats[] => {
  return mechanics.map(mechanic => {
    const mechanicRequests = requests.filter(request =>
      typeof request.masterId === 'object'
        ? request.masterId._id === mechanic._id
        : request.masterId === mechanic._id
    );

    return {
      id: mechanic._id,
      name: mechanic.login,
      totalRequests: mechanicRequests.length,
      pendingRequests: mechanicRequests.filter(r => r.status === 'В обработке').length,
      approvedRequests: mechanicRequests.filter(r => r.status === 'Принято').length,
      completedRequests: mechanicRequests.filter(r => r.status === 'Выполнено').length,
      cancelledRequests: mechanicRequests.filter(r => r.status === 'Отменено').length, // <--- ДОБАВЛЕНО
      totalItems: mechanicRequests.reduce((sum, req) => sum + (parseInt(req.quantity, 10) || 0), 0) // Добавил || 0 для безопасности
    };
  });
};

  const applyFilters = () => {
  // Удаляем неиспользуемую переменную filtered
  // Фильтр по механику теперь применяется в конце к пересчитанной статистике
    console.log('Applying filters with:', { timeRange, selectedMechanic, mechanics, requests });
 
  // Фильтр по дате (применяется к общему списку запросов)
  const now = new Date();
  let startDate: Date;
  
  switch (timeRange) {
    case 'Последняя неделя':
      startDate = subDays(now, 7);
      break;
    case 'Последний месяц':
      startDate = subDays(now, 30);
      break;
    case 'Последний год':
      startDate = subDays(now, 365);
      break;
    default:
      startDate = new Date(0);
  }
  
  // Пересчитываем статистику с учетом временного периода
  const filteredRequests = requests.filter(request => {
    const createdAt = new Date(request.createdAt);
    return createdAt >= startDate;
  });
  
  const recalculatedStats = calculateMechanicsStats(mechanics, filteredRequests);
  
  // Применяем фильтр по механику к пересчитанной статистике
  if (selectedMechanic !== 'Все механики') {
    setFilteredStats(recalculatedStats.filter(stat => stat.id === selectedMechanic));
  } else {
    setFilteredStats(recalculatedStats);
  }
};

  useEffect(() => {
    if (mechanics.length > 0 && requests.length > 0) {
      applyFilters();
    }
  }, [timeRange, selectedMechanic, mechanics, requests]);

  const handleMechanicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMechanic(e.target.value);
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  };

  const exportToPDF = async () => {
    if (!reportResultsRef.current) return;
  
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(reportResultsRef.current);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(canvas, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`Отчет_по_механикам_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      alert('Не удалось создать PDF файл');
    } finally {
      setIsExporting(false);
    }
  };

  const calculateTotalStatistics = () => {
    return {
      totalMechanics: filteredStats.length,
      totalRequests: filteredStats.reduce((sum, stat) => sum + stat.totalRequests, 0),
      pendingRequests: filteredStats.reduce((sum, stat) => sum + stat.pendingRequests, 0),
      completedRequests: filteredStats.reduce((sum, stat) => sum + stat.completedRequests, 0),
      totalItems: filteredStats.reduce((sum, stat) => sum + stat.totalItems, 0)
    };
  };

  const totalStats = calculateTotalStatistics();

  if (isLoading) {
    return <div className={styles.loading}>Загрузка данных...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.topBar}>
            <h1 className={styles.title}>Отчеты по запросам механиков</h1>
            
            <div className={styles.controls}>
              <button 
                className={styles.exportButton}
                onClick={exportToPDF}
                disabled={isExporting}
              >
                <FaFileExport />
                <span>{isExporting ? 'Экспорт...' : 'Экспорт в PDF'}</span>
              </button>
            </div>
          </div>
          
          <div className={styles.toolbar}>
            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <label htmlFor="timeRange">Период:</label>
                <select 
                  id="timeRange"
                  className={styles.filterSelect}
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                >
                  <option>Последняя неделя</option>
                  <option>Последний месяц</option>
                  <option>Последний год</option>
                </select>
              </div>
              
              <div className={styles.filterGroup}>
                <label htmlFor="mechanic">Механик:</label>
               <select
                id="mechanic"
                className={styles.filterSelect}
                value={selectedMechanic}
                onChange={handleMechanicChange}
              >
                <option value="Все механики">Все механики</option>
                {mechanics.length > 0 ? (
                  mechanics.map(mechanic => (
                    <option key={mechanic._id} value={mechanic._id}>
                      {mechanic.login}
                    </option>
                  ))
                ) : (
                  <option disabled>Нет доступных механиков</option>
                )}
              </select>
              </div>
            </div>
          </div>
        </header>
        
        <main className={styles.content} ref={reportResultsRef}>
          <div className={styles.statsGrid}>
            <div className={styles.statsCard}>
              <div>
                <p className={styles.statsTitle}>Всего механиков</p>
                <p className={styles.statsValue}>{totalStats.totalMechanics}</p>
              </div>
              <div className={`${styles.statsIcon} ${styles.blue}`}>
                <FaUserCog />
              </div>
            </div>
            
            <div className={styles.statsCard}>
              <div>
                <p className={styles.statsTitle}>Всего запросов</p>
                <p className={styles.statsValue}>{totalStats.totalRequests}</p>
              </div>
              <div className={`${styles.statsIcon} ${styles.purple}`}>
                <FaClipboardList />
              </div>
            </div>
            
            <div className={styles.statsCard}>
              <div>
                <p className={styles.statsTitle}>Выполнено</p>
                <p className={styles.statsValue}>{totalStats.completedRequests}</p>
              </div>
              <div className={`${styles.statsIcon} ${styles.green}`}>
                <FaBoxes />
              </div>
            </div>
          </div>
          
          <div className={styles.reportsSection}>
            <h2 className={styles.sectionTitle}>
              Статистика по механикам ({timeRange.toLowerCase()})
            </h2>
            
            <div className={styles.requestsTable}>
  <table>
    <thead>
      <tr>
        <th>Механик</th>
        <th>Всего запросов</th>
        <th>В обработке</th>
        <th>Принято</th>
        <th>Выполнено</th>
        <th>Отменено</th> {/* <--- НОВЫЙ ЗАГОЛОВОК */}
        <th>Количество</th>
      </tr>
    </thead>
    <tbody>
      {filteredStats.map(stat => (
        <tr key={stat.id}>
          <td>{stat.name}</td>
          <td>{stat.totalRequests}</td>
          <td>
            <span className={`${styles.statusBadge} ${styles.pending}`}>
              {stat.pendingRequests}
            </span>
          </td>
          <td>
            <span className={`${styles.statusBadge} ${styles.approved}`}>
              {stat.approvedRequests}
            </span>
          </td>
          <td>
            <span className={`${styles.statusBadge} ${styles.completed}`}>
              {stat.completedRequests}
            </span>
          </td>
          <td>
            <span className={`${styles.statusBadge} ${styles.cancelled}`}>
              {stat.cancelledRequests}
            </span>
          </td>
          <td>{stat.totalItems}</td>
        </tr>
      ))}
    </tbody>
  </table>

  {filteredStats.length === 0 && (
    <div className={styles.noResults}>Нет данных для отображения</div>
  )}
</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
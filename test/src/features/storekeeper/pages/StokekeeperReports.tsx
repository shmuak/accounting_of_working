import React, { useState, useEffect, useRef } from 'react';
import { FaBoxes, FaExclamationTriangle, FaClipboardList, FaSyncAlt, FaFileExport } from 'react-icons/fa';
import { format, subDays } from 'date-fns';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import styles from '../../../shared/styles/pages/storekeeper/stokekeeperReports.module.scss';

interface InventoryRequest {
  id: number;
  name: string;
  quantity: number;
  status: 'pending' | 'approved' | 'completed';
  createdAt: string;
  requestedBy: string;
  workshop: string;
}

const ReportsPage = () => {
  const [requests, setRequests] = useState<InventoryRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<InventoryRequest[]>([]);
  const [timeRange, setTimeRange] = useState<string>('Последний месяц');
  const [selectedStatus, setSelectedStatus] = useState<string>('Все статусы');
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>('Все цеха');
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const reportResultsRef = useRef<HTMLDivElement>(null);

  // Моковые данные - замените на реальные запросы к API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Здесь должен быть реальный запрос к API
        const mockRequests: InventoryRequest[] = [
          {
            id: 1,
            name: 'Подшипник 6205-2RSH',
            quantity: 2,
            status: 'completed',
            createdAt: '2023-05-15T10:30:00',
            requestedBy: 'Иванов И.И.',
            workshop: 'Цех №1'
          },
          // ... другие заявки
        ];
        
        setRequests(mockRequests);
        applyFilters(mockRequests, 'Все статусы', 'Последний месяц', 'Все цеха');
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const applyFilters = (
    requests: InventoryRequest[], 
    status: string, 
    range: string,
    workshop: string
  ) => {
    let filtered = [...requests];
    
    // Фильтр по статусу
    if (status !== 'Все статусы') {
      filtered = filtered.filter(request => request.status === status.toLowerCase());
    }
    
    // Фильтр по цеху
    if (workshop !== 'Все цеха') {
      filtered = filtered.filter(request => request.workshop === workshop);
    }
    
    // Фильтр по дате
    const now = new Date();
    let startDate: Date;
    
    switch (range) {
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
    
    filtered = filtered.filter(request => {
      const createdAt = new Date(request.createdAt);
      return createdAt >= startDate;
    });
    
    setFilteredRequests(filtered);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setSelectedStatus(status);
    applyFilters(requests, status, timeRange, selectedWorkshop);
  };

  const handleWorkshopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const workshop = e.target.value;
    setSelectedWorkshop(workshop);
    applyFilters(requests, selectedStatus, timeRange, workshop);
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const range = e.target.value;
    setTimeRange(range);
    applyFilters(requests, selectedStatus, range, selectedWorkshop);
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
      pdf.save(`Отчет_по_складу_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      alert('Не удалось создать PDF файл');
    } finally {
      setIsExporting(false);
    }
  };

  const calculateStatistics = () => {
    const totalRequests = filteredRequests.length;
    const pendingRequests = filteredRequests.filter(r => r.status === 'pending').length;
    const completedRequests = filteredRequests.filter(r => r.status === 'completed').length;
    const totalItemsRequested = filteredRequests.reduce((sum, req) => sum + req.quantity, 0);
    
    return {
      totalRequests,
      pendingRequests,
      completedRequests,
      totalItemsRequested
    };
  };

  const stats = calculateStatistics();

  if (isLoading) {
    return <div className={styles.loading}>Загрузка данных...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Основное содержимое */}
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.topBar}>
            <h1 className={styles.title}>Отчеты по складу</h1>
            
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
      <label htmlFor="status">Статус:</label>
      <select 
        id="status"
        className={styles.filterSelect}
        value={selectedStatus}
        onChange={handleStatusChange}
      >
        <option>Все статусы</option>
        <option>pending</option>
        <option>approved</option>
        <option>completed</option>
      </select>
    </div>
    
    <div className={styles.filterGroup}>
      <label htmlFor="workshop">Цех:</label>
      <select 
        id="workshop"
        className={styles.filterSelect}
        value={selectedWorkshop}
        onChange={handleWorkshopChange}
      >
        <option>Все цеха</option>
        <option>Цех №1</option>
        <option>Цех №2</option>
        <option>Склад</option>
      </select>
    </div>
    
    <button 
      className={styles.refreshButton}
      title="Обновить данные"
    >
      <FaSyncAlt />
    </button>
  </div>
</div>
        </header>
        
        {/* Основной контент */}
        <main className={styles.content} ref={reportResultsRef}>
          <div className={styles.statsGrid}>
            <div className={styles.statsCard}>
              <div>
                <p className={styles.statsTitle}>Всего заявок</p>
                <p className={styles.statsValue}>{stats.totalRequests}</p>
              </div>
              <div className={`${styles.statsIcon} ${styles.blue}`}>
                <FaClipboardList />
              </div>
            </div>
            
            <div className={styles.statsCard}>
              <div>
                <p className={styles.statsTitle}>Новые заявки</p>
                <p className={styles.statsValue}>{stats.pendingRequests}</p>
              </div>
              <div className={`${styles.statsIcon} ${styles.yellow}`}>
                <FaExclamationTriangle />
              </div>
            </div>
            
            <div className={styles.statsCard}>
              <div>
                <p className={styles.statsTitle}>Выполнено</p>
                <p className={styles.statsValue}>{stats.completedRequests}</p>
              </div>
              <div className={`${styles.statsIcon} ${styles.green}`}>
                <FaBoxes />
              </div>
            </div>
            
            <div className={styles.statsCard}>
              <div>
                <p className={styles.statsTitle}>Всего позиций</p>
                <p className={styles.statsValue}>{stats.totalItemsRequested}</p>
              </div>
              <div className={`${styles.statsIcon} ${styles.purple}`}>
                <FaBoxes />
              </div>
            </div>
          </div>
          
          <div className={styles.reportsSection}>
            <h2 className={styles.sectionTitle}>
              Детализация заявок ({timeRange.toLowerCase()})
            </h2>
            
            <div className={styles.requestsTable}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Наименование</th>
                    <th>Количество</th>
                    <th>Статус</th>
                    <th>Цех</th>
                    <th>Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map(request => (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>{request.name}</td>
                      <td>{request.quantity}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[request.status]}`}>
                          {request.status}
                        </span>
                      </td>
                      <td>{request.workshop}</td>
                      <td>{format(new Date(request.createdAt), 'dd.MM.yyyy HH:mm')}</td>                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredRequests.length === 0 && (
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
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import styles from '../../../../shared/styles/pages/dispatcher/reports.module.scss';
import { fetchUsers, fetchWorkshops, fetchRequestsMechabnic } from '../../api';
import { IUser, IWorkshop, IRequestMechanic } from '../../../../shared/types';
import { format, subDays } from 'date-fns';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface IRequestExtended extends IRequestMechanic {
  createdAt: string;
  updatedAt: string;
}

const Reports: React.FC = () => {
  const requestsChartRef = useRef<HTMLCanvasElement>(null);
  const reportResultsRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [mechanics, setMechanics] = useState<{_id: string, login: string}[]>([]);
  const [workshops, setWorkshops] = useState<IWorkshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('Все статусы');
  const [selectedMechanic, setSelectedMechanic] = useState<string>('Все слесари');
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>('Все цеха');
  const [requests, setRequests] = useState<IRequestExtended[]>([]);
  const [timeRange, setTimeRange] = useState<string>('Последний месяц');
  const [filteredRequests, setFilteredRequests] = useState<IRequestExtended[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    if (!reportResultsRef.current) return;
  
    setIsExporting(true);
    let originalWidth: number | undefined;
    let originalHeight: number | undefined;
  
    try {
      if (requestsChartRef.current) {
        originalWidth = requestsChartRef.current.width;
        originalHeight = requestsChartRef.current.height;
      }
  
      const canvas = await html2canvas(reportResultsRef.current, {
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
  
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(canvas, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`Отчет_по_заявкам_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      alert('Не удалось создать PDF файл');
    } finally {
      setIsExporting(false);
      
      if (requestsChartRef.current && originalWidth && originalHeight) {
        requestsChartRef.current.width = originalWidth;
        requestsChartRef.current.height = originalHeight;
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mechanicsData = await fetchUsers();
        setMechanics(mechanicsData.filter((user: IUser) => user.role === 'MECHANIC'));
        
        const workshopsData = await fetchWorkshops();
        setWorkshops(workshopsData);
        
        await loadRequests();
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadRequests = async () => {
    try {
      const requestsData = await fetchRequestsMechabnic();
      setRequests(requestsData as IRequestExtended[]);
      applyFilters(requestsData as IRequestExtended[], selectedStatus, timeRange, selectedMechanic, selectedWorkshop);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const applyFilters = (
    requests: IRequestExtended[], 
    status: string, 
    range: string,
    mechanicId: string,
    workshopId: string
  ) => {
    let filtered = [...requests];
    
    // Фильтр по статусу
    if (status !== 'Все статусы') {
      filtered = filtered.filter(request => request.status === status);
    }
    
    // Фильтр по механику
    if (mechanicId !== 'Все слесари') {
      filtered = filtered.filter(request => {
        if (typeof request.masterId === 'string') {
          return request.masterId === mechanicId;
        } else if (request.masterId && typeof request.masterId === 'object') {
          return request.masterId._id === mechanicId;
        }
        return false;
      });
    }
    
    // Фильтр по цеху
    if (workshopId !== 'Все цеха') {
      filtered = filtered.filter(request => {
        if (typeof request.equipmentId === 'object' && request.equipmentId !== null) {
          return request.equipmentId.workshopId === workshopId || 
                 (typeof request.equipmentId.workshopId === 'object' && 
                  request.equipmentId.workshopId._id === workshopId);
        }
        return false;
      });
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

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setSelectedStatus(status);
    applyFilters(requests, status, timeRange, selectedMechanic, selectedWorkshop);
  };

  const handleMechanicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mechanicId = e.target.value;
    setSelectedMechanic(mechanicId);
    applyFilters(requests, selectedStatus, timeRange, mechanicId, selectedWorkshop);
  };

  const handleWorkshopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const workshopId = e.target.value;
    setSelectedWorkshop(workshopId);
    applyFilters(requests, selectedStatus, timeRange, selectedMechanic, workshopId);
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const range = e.target.value;
    setTimeRange(range);
    applyFilters(requests, selectedStatus, range, selectedMechanic, selectedWorkshop);
  };

  const prepareChartData = () => {
    const groupedByDate: Record<string, { new: number, inProgress: number, completed: number }> = {};
    
    filteredRequests.forEach(request => {
      const date = format(new Date(request.createdAt), 'dd MMM');
      
      if (!groupedByDate[date]) {
        groupedByDate[date] = { new: 0, inProgress: 0, completed: 0 };
      }
      
      if (request.status === 'Pending') {
        groupedByDate[date].new++;
      } else if (request.status === 'Approved') {
        groupedByDate[date].inProgress++;
      } else if (request.status === 'Cancelled') {
        groupedByDate[date].completed++;
      }
    });
    
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
    
    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'Новые',
          data: sortedDates.map(date => groupedByDate[date].new),
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'В работе',
          data: sortedDates.map(date => groupedByDate[date].inProgress),
          borderColor: 'rgba(252, 211, 77, 1)',
          backgroundColor: 'rgba(252, 211, 77, 0.1)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Завершено',
          data: sortedDates.map(date => groupedByDate[date].completed),
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    };
  };

  useEffect(() => {
    if (requestsChartRef.current && !isLoading && filteredRequests.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = requestsChartRef.current.getContext('2d');
      if (ctx) {
        const chartData = prepareChartData();
        
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  font: {
                    size: 14
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  font: {
                    size: 12
                  }
                }
              },
              x: {
                ticks: {
                  font: {
                    size: 12
                  }
                }
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [isLoading, filteredRequests]);

  if (isLoading) {
    return <div className={styles.loading}>Загрузка данных...</div>;
  }

  return (
    <div className={styles.reports}>
      <div className={styles.header}>
        <h2 className={styles.title}>Отчеты по заявкам</h2>
        <div className={styles.actions}>
          <button 
            className={`${styles.btn} ${styles.primary}`}
            onClick={exportToPDF}
            disabled={isExporting}
          >
            {isExporting ? (
              <span>Создание PDF...</span>
            ) : (
              <>
                <i className="fas fa-file-export"></i> Экспорт в PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className={styles.reportContent}>
        <div className={styles.reportParams}>
          <h3 className={styles.subtitle}>Параметры отчета</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Период</label>
            <select 
              className={styles.formControl} 
              value={timeRange}
              onChange={handleTimeRangeChange}
            >
              <option value="Последняя неделя">Последняя неделя</option>
              <option value="Последний месяц">Последний месяц</option>
              <option value="Последний год">Последний год</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Цех</label>
            <select 
              className={styles.formControl} 
              value={selectedWorkshop}
              onChange={handleWorkshopChange}
            >
              <option value="Все цеха">Все цеха</option>
              {workshops.map(workshop => (
                <option key={workshop._id} value={workshop._id}>
                  {workshop.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Слесарь</label>
            <select 
              className={styles.formControl} 
              value={selectedMechanic}
              onChange={handleMechanicChange}
            >
              <option value="Все слесари">Все слесари</option>
              {mechanics.map(mechanic => (
                <option key={mechanic._id} value={mechanic._id}>
                  {mechanic.login}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Статус</label>
            <select 
              className={styles.formControl} 
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option value="Все статусы">Все статусы</option>
              <option value="Pending">Новые</option>
              <option value="Approved">В работе</option>
              <option value="Rejected">Завершено</option>
            </select>
          </div>
        </div>

        <div className={styles.reportResults} ref={reportResultsRef}>
          <h3 className={styles.subtitle}>
            {selectedStatus === 'Все статусы' 
              ? `Статистика за ${timeRange.toLowerCase()}` 
              : `Статистика по заявкам со статусом "${selectedStatus}" за ${timeRange.toLowerCase()}`}
          </h3>
          
          <div className={styles.chartContainer}>
            <canvas 
              ref={requestsChartRef} 
              height={500}
              width={800}
            ></canvas>
          </div>

          <div className={styles.statsTable}>
            {/* <table className={styles.table}>
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
                  <td>{stats.totalRequests}</td>
                </tr>
              </tbody>
            </table> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
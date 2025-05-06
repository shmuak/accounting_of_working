import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Типы данных
export interface WorkloadData {
  mechanic: string;
  plannedHours: number;
  unplannedHours: number;
  totalHours: number;
  capacity: number;
}

interface WorkloadChartProps {
  data: WorkloadData[];
}

// Регистрируем необходимые компоненты Chart.js
Chart.register(...registerables);

const WorkloadChart = ({ data }: WorkloadChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Конфигурация графика
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: data.map(item => item.mechanic),
        datasets: [
          {
            label: 'Плановое обслуживание',
            data: data.map(item => item.plannedHours),
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb',
            borderWidth: 1
          },
          {
            label: 'Неплановые заявки',
            data: data.map(item => item.unplannedHours),
            backgroundColor: '#ef4444',
            borderColor: '#dc2626',
            borderWidth: 1
          },
          {
            label: 'Общая загрузка',
            data: data.map(item => item.totalHours),
            backgroundColor: '#10b981',
            borderColor: '#059669',
            borderWidth: 2,
            type: 'line',
            fill: false
          },
          {
            label: 'Максимальная загрузка',
            data: data.map(item => item.capacity),
            backgroundColor: 'transparent',
            borderColor: '#6b7280',
            borderWidth: 1,
            borderDash: [5, 5],
            type: 'line',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Часы'
            },
            max: Math.max(...data.map(item => item.capacity)) + 10
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              afterBody: (context) => {
                const dataItem = data[context[0].dataIndex];
                const utilization = Math.round((dataItem.totalHours / dataItem.capacity) * 100);
                return [`Загрузка: ${utilization}%`];
              }
            }
          },
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Загрузка механиков (часы)'
          }
        }
      }
    };

    // Создаем или обновляем график
    if (chartInstance.current) {
      chartInstance.current.data = config.data;
      chartInstance.current.update();
    } else {
      chartInstance.current = new Chart(ctx, config);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default WorkloadChart;
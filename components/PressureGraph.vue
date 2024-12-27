<template>
  <div class="pressure-graph">
    <div class="pressure-graph-header">
      <h3>{{ $t('pressure.title') }}</h3>
      <p class="current-pressure">{{ currentPressure }} hPa</p>
    </div>
    <div class="graph-container">
      <div class="graph-scroll-container">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
  } from 'chart.js';
  import { computed } from 'vue';
  import { Line } from 'vue-chartjs';
  import { useI18n } from 'vue-i18n';
  import type { ForecastItem } from '~/types/weather';
  import { formatTime } from '~/utils/dateUtils';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const props = defineProps<{
    forecast: ForecastItem[];
    currentPressure: number;
  }>();

  const { locale, t } = useI18n();

  // 気圧変化の閾値定義
  const PRESSURE_THRESHOLDS = {
    MILD: -0.025, // 1時間あたり0.5hPa以上の低下
    MODERATE: -0.05, // 1時間あたり1hPa以上の低下
    SEVERE: -0.1, // 1時間あたり2hPa以上の低下
  };

  // 線形補間を行う関数
  const interpolatePressure = (
    startPressure: number,
    endPressure: number,
    steps: number
  ) => {
    const pressureDiff = endPressure - startPressure;
    const stepValue = pressureDiff / steps;
    return Array.from(
      { length: steps },
      (_, i) => startPressure + stepValue * i
    );
  };

  const interpolateTime = (startTime: Date, endTime: Date, steps: number) => {
    const timeInterval = (endTime.getTime() - startTime.getTime()) / steps;
    return Array.from({ length: steps }, (_, i) => {
      const interpolatedTime = new Date(startTime.getTime() + timeInterval * i);
      return {
        formatted: formatTime(interpolatedTime.toISOString(), locale.value),
        raw: interpolatedTime,
      };
    });
  };

  // 気圧変化に応じた背景色を返す関数
  const getPressureDropColor = (pressureChange: number) => {
    if (pressureChange <= PRESSURE_THRESHOLDS.SEVERE) {
      return 'rgba(255, 69, 0, 0.2)'; // 重度の低下: 赤オレンジ
    } else if (pressureChange <= PRESSURE_THRESHOLDS.MODERATE) {
      return 'rgba(255, 165, 0, 0.2)'; // 中度の低下: オレンジ
    } else if (pressureChange <= PRESSURE_THRESHOLDS.MILD) {
      return 'rgba(255, 255, 0, 0.2)'; // 軽度の低下: 黄色
    }
    return 'rgba(255, 255, 255, 0)'; // 低下なし: 透明
  };

  // 48時間分のデータを生成（表示は24時間分）
  const hourlyPressureData = computed(() => {
    const now = new Date();
    const fortyEightHoursLater = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const filteredData = props.forecast.filter(item => {
      const itemDate = new Date(item.dt_txt);
      return itemDate <= fortyEightHoursLater;
    });

    const interpolatedData = [];

    for (let i = 0; i < filteredData.length - 1; i++) {
      const startTime = new Date(filteredData[i].dt_txt);
      const endTime = new Date(filteredData[i + 1].dt_txt);
      const startPressure = filteredData[i].main.pressure;
      const endPressure = filteredData[i + 1].main.pressure;

      const times = interpolateTime(startTime, endTime, 3);
      const pressures = interpolatePressure(startPressure, endPressure, 3);

      times.forEach((time, index) => {
        const pressureChange =
          index === 0 ? 0 : pressures[index] - pressures[index - 1];
        interpolatedData.push({
          time: time.formatted,
          rawTime: time.raw,
          pressure: pressures[index],
          pressureChange: pressureChange,
        });
      });
    }

    // 最後のデータポイントを追加
    const lastItem = filteredData[filteredData.length - 1];
    interpolatedData.push({
      time: formatTime(lastItem.dt_txt, locale.value),
      rawTime: new Date(lastItem.dt_txt),
      pressure: lastItem.main.pressure,
      pressureChange: 0,
    });

    return interpolatedData;
  });

  const chartData = computed(() => ({
    labels: hourlyPressureData.value.map(item => item.time),
    datasets: [
      {
        label: t('pressure.title'),
        data: hourlyPressureData.value.map(item => item.pressure),
        borderColor: '#0066cc',
        backgroundColor: hourlyPressureData.value.map(item =>
          getPressureDropColor(item.pressureChange)
        ),
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        fill: true,
      },
    ],
  }));

  const chartOptions = computed<ChartOptions<'line'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: context => {
            const dataPoint = hourlyPressureData.value[context.dataIndex];
            let label = `${context.parsed.y.toFixed(1)} hPa`;
            if (dataPoint.pressureChange < 0) {
              label += ` (${dataPoint.pressureChange.toFixed(1)} hPa/h)`;
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          font: {
            size: 12,
          },
          callback: value => `${value} hPa`,
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: true,
        },
      },
    },
  }));
</script>

<style scoped>
  .pressure-graph {
    padding: 1rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .graph-container {
    position: relative;
    height: 300px;
    overflow: hidden;
  }

  .graph-scroll-container {
    position: absolute;
    width: 200%; /* 48時間分のデータを表示できる幅 */
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .pressure-graph-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .pressure-graph-header h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
  }

  .current-pressure {
    font-size: 1.2rem;
    font-weight: bold;
    color: #0066cc;
    margin: 0;
  }

  /* スクロールバーのスタイリング */
  .graph-scroll-container::-webkit-scrollbar {
    height: 8px;
  }

  .graph-scroll-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .graph-scroll-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  .graph-scroll-container::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  @media (max-width: 768px) {
    .pressure-graph {
      padding: 0.5rem;
    }

    .graph-container {
      height: 250px;
    }

    .pressure-graph-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .pressure-graph-header h3 {
      font-size: 1rem;
    }

    .current-pressure {
      font-size: 1rem;
    }
  }
</style>

<template>
  <div v-if="groupedForecast" class="forecast-display">
    <h2>{{ $t('forecast') }}</h2>
    <div class="forecast-grid">
      <div class="time-column">
        <div class="date-tile"></div>
        <div v-for="time in forecastTimes" :key="time" class="time-slot">
          {{ time }}
        </div>
      </div>
      <div
        v-for="(data, date) in nextFiveDays"
        :key="date"
        class="forecast-day"
      >
        <div class="date-tile">
          <h3>{{ formatDate(date, locale) }}</h3>
          <img
            :src="getWeatherIconUrl(data.icon)"
            :alt="data.items[0].weather[0].description"
            class="forecast-icon"
          />
          <p class="average-temp">
            {{ $t('averageTemp') }}: {{ formatTemperature(data.averageTemp) }}
          </p>
        </div>
        <div class="forecast-items">
          <div v-for="time in forecastTimes" :key="time" class="forecast-item">
            <template v-if="getItemForTime(data.items, time)">
              <span class="temp">{{
                formatTemperature(getItemForTime(data.items, time).main.temp)
              }}</span>
              <span class="desc">{{
                getItemForTime(data.items, time).weather[0].description
              }}</span>
            </template>
            <template v-else>
              <span class="no-data">-</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { ForecastItem, GroupedForecast } from '~/types/weather';
  import { formatDate } from '~/utils/dateUtils';
  import { getWeatherIconUrl } from '~/utils/weatherUtils';

  const props = defineProps<{
    groupedForecast: GroupedForecast;
  }>();

  const { locale, t } = useI18n();

  const nextFiveDays = computed(() => {
    const dates = Object.keys(props.groupedForecast).sort();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const startIndex = dates.findIndex(date => date >= tomorrowStr);
    return Object.fromEntries(
      dates
        .slice(startIndex, startIndex + 5)
        .map(date => [date, props.groupedForecast[date]])
    );
  });

  const forecastTimes = computed(() => {
    const times = new Set<string>();
    Object.values(props.groupedForecast).forEach(day => {
      day.items.forEach(item => {
        times.add(item.dt_txt.split(' ')[1].slice(0, 5));
      });
    });
    return Array.from(times).sort();
  });

  const formatTemperature = (temp: number): string => {
    return `${temp.toFixed(1)}°C`;
  };

  const getItemForTime = (
    items: ForecastItem[],
    time: string
  ): ForecastItem | undefined => {
    return items.find(item => item.dt_txt.split(' ')[1].startsWith(time));
  };
</script>

<style scoped>
  .forecast-display {
    margin: 2rem 0;
    overflow-x: auto;
  }

  .forecast-grid {
    display: flex;
    min-width: 800px;
  }

  .time-column {
    min-width: 80px;
    background-color: #f8f9fa;
    border-right: 1px solid #e9ecef;
    padding: 1rem 0.5rem;
  }

  .time-slot {
    height: 83.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .forecast-day {
    flex: 1;
    min-width: 150px;
    display: flex;
    flex-direction: column;
    background-color: #f8f9fa;
    border-left: 1px solid #e9ecef;
    padding: 1rem 0.5rem;
  }

  .date-tile {
    background-color: #e9ecef;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    margin-bottom: 1rem;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .date-tile h3 {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;
  }

  .forecast-icon {
    width: 50px;
    height: 50px;
    margin: 0.5rem auto;
  }

  .average-temp {
    margin: 0.5rem 0 0;
    font-size: 0.9rem;
    color: #666;
  }

  .forecast-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .forecast-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    border-radius: 4px;
    padding: 0.5rem;
    height: 60px;
  }

  .temp {
    font-weight: bold;
    color: #0066cc;
    min-width: 60px;
  }

  .desc {
    font-size: 0.8rem;
    text-transform: capitalize;
    color: #666;
    text-align: right;
    flex: 1;
  }

  .no-data {
    color: #999;
  }

  @media (max-width: 768px) {
    .forecast-grid {
      flex-direction: column;
      min-width: auto;
    }

    .time-column {
      display: none;
    }

    .forecast-day {
      width: 100%;
      border-left: none;
      border-top: 1px solid #e9ecef;
    }

    .forecast-item {
      flex-direction: column;
      height: auto;
      align-items: flex-start;
    }

    .forecast-item::before {
      content: attr(data-time);
      font-weight: bold;
      margin-bottom: 0.25rem;
    }
  }
</style>

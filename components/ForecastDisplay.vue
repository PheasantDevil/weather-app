<template>
  <div v-if="groupedForecast" class="forecast-display">
    <h2>{{ $t('forecast') }}</h2>
    <div class="forecast-grid">
      <div
        v-for="(data, date) in groupedForecast"
        :key="date"
        class="forecast-day"
      >
        <div class="forecast-day-header">
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
          <div v-for="item in data.items" :key="item.dt" class="forecast-item">
            <span class="time">{{ formatTime(item.dt_txt, locale) }}</span>
            <span class="temp">{{ formatTemperature(item.main.temp) }}</span>
            <span class="desc">{{ item.weather[0].description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import type { GroupedForecast } from '~/types/weather';
  import { formatDate, formatTime } from '~/utils/dateUtils';
  import { getWeatherIconUrl } from '~/utils/weatherUtils';

  const props = defineProps<{
    groupedForecast: GroupedForecast;
  }>();

  const { locale } = useI18n();

  const formatTemperature = (temp: number): string => {
    return `${temp.toFixed(1)}°C`;
  };
</script>

<style scoped>
  .forecast-display {
    margin: 2rem 0;
  }

  .forecast-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .forecast-day {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
  }

  .forecast-day-header {
    text-align: center;
    margin-bottom: 1rem;
  }

  .forecast-icon {
    width: 50px;
    height: 50px;
    margin: 0.5rem 0;
  }

  .average-temp {
    color: #666;
    font-size: 0.9rem;
  }

  .forecast-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .forecast-item {
    display: grid;
    grid-template-columns: auto auto 1fr;
    gap: 1rem;
    align-items: center;
    padding: 0.5rem;
    border-radius: 4px;
    background-color: white;
  }

  .time {
    font-weight: bold;
  }

  .temp {
    color: #0066cc;
  }

  .desc {
    text-transform: capitalize;
    color: #666;
  }
</style>

<template>
  <div v-if="weather" class="weather-display">
    <h2>{{ $t('currentWeather') }} {{ weather.name }}</h2>
    <div class="weather-content">
      <img
        :src="getWeatherIconUrl(weather.weather[0].icon)"
        :alt="weather.weather[0].description"
        class="weather-icon"
      />
      <div class="weather-info">
        <p class="temperature">
          {{ $t('temperature') }}: {{ formatTemperature(weather.main.temp) }}
        </p>
        <p class="description">
          {{ $t('weather') }}: {{ weather.weather[0].description }}
        </p>
        <p v-if="weather.main.feels_like" class="feels-like">
          {{ $t('feelsLike') }}:
          {{ formatTemperature(weather.main.feels_like) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { WeatherData } from '~/types/weather';
  import { getWeatherIconUrl } from '~/utils/weatherUtils';

  const props = defineProps<{
    weather: WeatherData;
  }>();

  const formatTemperature = (temp: number): string => {
    return `${temp.toFixed(1)}°C`;
  };
</script>

<style scoped>
  .weather-display {
    padding: 1rem;
    border-radius: 8px;
    background-color: #f8f9fa;
    margin: 1rem 0;
  }

  .weather-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .weather-icon {
    width: 100px;
    height: 100px;
  }

  .weather-info {
    text-align: left;
  }

  .temperature {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .description {
    text-transform: capitalize;
  }

  .feels-like {
    color: #666;
    font-size: 0.9rem;
  }
</style>

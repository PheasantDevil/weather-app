<template>
  <div v-if="weather && todayForecast" class="weather-display">
    <h2>{{ $t('currentWeather') }} {{ weather.name }}</h2>
    <div class="weather-content">
      <div class="current-weather">
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

      <!-- 気圧情報セクション -->
      <div class="pressure-section">
        <PressureDisplay :weather="weather" />
        <PressureGraph
          :forecast="forecast"
          :current-pressure="weather.main.pressure"
          class="pressure-graph-container"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, watchEffect } from 'vue';
  import { useI18n } from 'vue-i18n';
  import PressureDisplay from '~/components/PressureDisplay.vue';
  import PressureGraph from '~/components/PressureGraph.vue';
  import type { ForecastItem, WeatherData } from '~/types/weather';
  import { getWeatherIconUrl } from '~/utils/weatherUtils';

  const props = defineProps<{
    weather: WeatherData;
    forecast: ForecastItem[];
  }>();

  const { locale } = useI18n();

  const todayForecast = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return props.forecast.filter(item => item.dt_txt.startsWith(today));
  });

  const formatTemperature = (temp: number): string => {
    return `${temp.toFixed(1)}°C`;
  };

  const preloadWeatherIcons = () => {
    if (!props.weather || !props.forecast) return;

    // 現在の天気アイコン
    const currentIcon = props.weather.weather[0].icon;
    new Image().src = getWeatherIconUrl(currentIcon);

    // 予報のアイコン
    const forecastIcons = new Set(
      todayForecast.value.map(item => item.weather[0].icon)
    );

    forecastIcons.forEach(icon => {
      new Image().src = getWeatherIconUrl(icon);
    });
  };

  watchEffect(() => {
    preloadWeatherIcons();
  });
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
    flex-direction: column;
    gap: 1rem;
  }

  .current-weather {
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

  /* 気圧情報セクションのスタイル */
  .pressure-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 4rem;
  }

  .pressure-graph-container {
    height: 300px;
    width: 100%;
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

  .today-forecast {
    display: flex;
    overflow-x: auto;
    gap: 1rem;
    padding: 1rem 0;
  }

  .forecast-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
  }

  .forecast-icon {
    width: 50px;
    height: 50px;
  }

  .time,
  .temp {
    font-size: 0.9rem;
    margin: 0.25rem 0;
  }

  @media (max-width: 768px) {
    .current-weather {
      flex-direction: column;
      text-align: center;
    }

    .weather-info {
      text-align: center;
    }

    .pressure-section {
      padding: 0.5rem;
    }

    .pressure-graph-container {
      height: 250px;
    }

    .today-forecast {
      padding: 1rem;
      justify-content: flex-start;
    }

    .forecast-item {
      min-width: 70px;
    }
  }

  @media (max-width: 480px) {
    .weather-icon {
      width: 80px;
      height: 80px;
    }

    .temperature {
      font-size: 1.2rem;
    }

    .pressure-graph-container {
      height: 200px;
    }
  }
</style>

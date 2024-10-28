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
        <div
          :class="[
            'weather-display',
            backgroundClass,
            { 'animated-background': isAnimated },
          ]"
        >
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
      <div class="today-forecast">
        <div v-for="item in todayForecast" :key="item.dt" class="forecast-item">
          <p class="time">{{ formatTime(item.dt_txt, locale) }}</p>
          <img
            :src="getWeatherIconUrl(item.weather[0].icon)"
            :alt="item.weather[0].description"
            class="forecast-icon"
          />
          <p class="temp">{{ formatTemperature(item.main.temp) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { ForecastItem, WeatherData } from '~/types/weather';
  import { formatTime } from '~/utils/dateUtils';
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

  const backgroundClass = computed(() => {
    const icon = props.weather?.weather[0].icon;
    switch (icon) {
      case '10d':
      case '10n':
        return 'rainy-background';
      case '01d':
        return 'sunny-background';
      // 他の天気条件に応じたクラス名を追加
      default:
        return 'default-background';
    }
  });

  const isAnimated = computed(() => {
    const icon = props.weather?.weather[0].icon;
    // アニメーションが必要な天気コードを指定
    return ['10d', '10n', '01d', '01n'].includes(icon);
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

  /* 晴れの背景 */
  .sunny-background {
    background: linear-gradient(to bottom, #87ceeb, #f0e68c);
    animation: sunnyEffect 20s linear infinite;
  }

  /* 雨の背景 */
  .rainy-background {
    background: #a0a0a0;
    overflow: hidden;
  }

  /* 雨のアニメーション */
  .rainy-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/path/to/rain-drop.png'); /* 雨粒画像を指定 */
    background-size: contain;
    opacity: 0.3;
    animation: rainEffect 0.5s linear infinite;
  }

  /* デフォルト背景 */
  .default-background {
    background: #d3d3d3;
  }

  /* アニメーション定義 */
  @keyframes sunnyEffect {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 100% 100%;
    }
  }

  @keyframes rainEffect {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100%);
    }
  }

  .animated-background {
    transition: background 0.5s ease-in-out;
  }
</style>

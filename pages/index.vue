<template>
  <WeatherBackground :weather="weather">
    <div class="weather-app">
      <LanguageSwitcher class="language-switcher" />
      <h1>{{ $t('weatherApp') }}</h1>

      <form @submit.prevent="getWeather" class="search-form">
        <div class="search-container">
          <input
            v-model="city"
            :placeholder="$t('enterCity')"
            :disabled="isLoading"
            class="city-input"
            required
          />
          <button type="submit" :disabled="isLoading" class="submit-button">
            <span class="button-text">
              {{ isLoading ? $t('loading') : $t('getWeather') }}
            </span>
          </button>
        </div>
      </form>

      <div v-if="showGuidelines" class="guidelines">
        <p>{{ $t('guidelines.kanji') }}</p>
        <p>{{ $t('guidelines.kana') }}</p>
        <p>{{ $t('guidelines.error') }}</p>
      </div>

      <div v-if="error" class="error-message">
        <p>{{ $t(`errors.${error.code}`, { message: error.message }) }}</p>
      </div>

      <WeatherDisplay
        :weather="weather"
        :forecast="forecast?.list"
        v-if="weather && forecast"
      />
      <ForecastDisplay
        :grouped-forecast="groupedForecast"
        v-if="groupedForecast"
      />
    </div>
  </WeatherBackground>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWeather } from '~/composables/useWeather';

  const city = ref('');
  const showGuidelines = ref(true);
  const {
    weather,
    forecast,
    groupedForecast,
    error,
    isLoading,
    fetchWeatherData,
  } = useWeather();

  onMounted(async () => {
  // ランダムで天気条件を取得
  await fetchWeatherData('Tokyo'); // 'Tokyo' などのデフォルトの都市を指定
  });

  const getWeather = async () => {
    if (!city.value.trim()) return;

    try {
      await fetchWeatherData(city.value);
      showGuidelines.value = false;
    } catch (err) {
      console.error('Failed to fetch weather data:', err);
    }
  };
</script>

<style scoped>
  .weather-app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    position: relative;
    z-index: 1;
  }

  .language-switcher {
    margin-bottom: 2rem;
  }

  .search-form {
    margin: 2rem 0;
  }

  .search-container {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .city-input {
    flex: 1;
    min-width: 200px;
    max-width: 400px;
  }

  .submit-button {
    white-space: nowrap;
    min-width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button-text {
    display: inline-block;
    transition: transform 0.2s;
  }

  .submit-button:hover .button-text {
    transform: scale(1.05);
  }

  @media (max-width: 480px) {
    .search-container {
      flex-direction: column;
    }

    .city-input,
    .submit-button {
      width: 100%;
      max-width: none;
    }
  }

  .guidelines {
    margin: 2rem 0;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 4px;
    color: #666;
  }

  .error-message {
    margin: 1rem 0;
    padding: 1rem;
    background-color: #fee;
    border-radius: 4px;
    color: #c00;
  }
</style>

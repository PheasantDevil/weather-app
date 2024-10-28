<template>
  <div class="weather-app">
    <LanguageSwitcher class="language-switcher" />
    <h1>{{ $t('weatherApp') }}</h1>

    <form @submit.prevent="getWeather" class="search-form">
      <div :class="['weather-app', backgroundClass]">
        <input
          v-model="city"
          :placeholder="$t('enterCity')"
          :disabled="isLoading"
          class="city-input"
          required
        />
        <button type="submit" :disabled="isLoading" class="submit-button">
          {{ isLoading ? $t('loading') : $t('getWeather') }}
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
</template>

<script setup lang="ts">
  import { ref } from 'vue';
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
  const backgroundClass = ref('');

  onMounted(() => {
    const weatherConditions = ['sunny', 'rainy', 'cloudy'];
    const randomCondition =
      weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    backgroundClass.value = `${randomCondition}-background`;
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
  }

  .language-switcher {
    margin-bottom: 2rem;
  }

  .search-form {
    margin: 2rem 0;
  }

  .city-input {
    padding: 0.75rem 1rem;
    border: 2px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
    max-width: 300px;
  }

  .submit-button {
    padding: 0.75rem 1.5rem;
    background-color: #0066cc;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .submit-button:hover:not(:disabled) {
    background-color: #0052a3;
  }

  .submit-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
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

  .sunny-background {
    background: linear-gradient(to bottom, #87ceeb, #ffd700);
    animation: sunnyEffect 15s linear infinite;
  }

  .rainy-background {
    background: #3f3f3f;
    overflow: hidden;
  }

  .rainy-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/path/to/rain-drop.png');
    background-size: contain;
    opacity: 0.2;
    animation: rainEffect 1s linear infinite;
  }

  .cloudy-background {
    background: linear-gradient(to bottom, #d3d3d3, #a9a9a9);
    animation: cloudyEffect 20s linear infinite;
  }

  @keyframes sunnyEffect {
    0% {
      background-position: 0 0;
    }
    100% {
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

  @keyframes cloudyEffect {
    0% {
      opacity: 0.8;
    }
    100% {
      opacity: 1;
    }
  }
</style>

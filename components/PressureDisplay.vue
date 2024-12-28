<template>
  <div v-if="weather" class="pressure-display">
    <h3>{{ $t('pressure.title') }}</h3>
    <div class="pressure-content">
      <div class="current-pressure">
        <p class="pressure-value">{{ weather.main.pressure }} hPa</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { WeatherData } from '~/types/weather';

  const props = defineProps<{
    weather: WeatherData;
  }>();
</script>

<style scoped>
  .pressure-display {
    padding: 1rem;
    border-radius: 8px;
    background-color: #f8f9fa;
    margin: 1rem 0;
  }

  .pressure-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .current-pressure {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pressure-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #0066cc;
  }

  @media (max-width: 768px) {
    .pressure-value {
      font-size: 1.2rem;
    }
  }
</style>

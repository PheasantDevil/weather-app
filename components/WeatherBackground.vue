<template>
  <div :class="['weather-background', backgroundClass]">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { WeatherData } from '~/types/weather';

const props = defineProps<{
  weather: WeatherData | null;
}>();

const backgroundClass = computed(() => {
  if (!props.weather) return '';
  
  const weatherMain = props.weather.weather[0].main.toLowerCase();
  const weatherId = props.weather.weather[0].id;
  
  // より詳細な天気条件の判定
  if (weatherId >= 200 && weatherId < 300) return 'thunderstorm-background';
  if (weatherId >= 300 && weatherId < 400) return 'drizzle-background';
  if (weatherId >= 500 && weatherId < 600) return 'rainy-background';
  if (weatherId >= 600 && weatherId < 700) return 'snow-background';
  if (weatherId === 800) return 'clear-background';
  if (weatherId > 800) return 'cloudy-background';
  
  return '';
});
</script>

<style scoped>
.weather-background {
  position: relative;
  min-height: 100vh;
  transition: background 0.5s ease;
  will-change: transform;
}

.clear-background {
  background: linear-gradient(45deg, #87ceeb, #ffd700);
  animation: sunnyEffect 20s ease-in-out infinite;
}

.rainy-background {
  background: linear-gradient(to bottom, #4a4a4a, #696969);
  position: relative;
  overflow: hidden;
}

.rainy-background::before {
  content: '';
  position: fixed;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    transparent,
    rgba(255, 255, 255, 0.2) 10px,
    transparent 20px
  );
  animation: rainEffect 1s linear infinite;
  pointer-events: none;
  backface-visibility: hidden;
  will-change: transform;
}

.cloudy-background {
  background: linear-gradient(to bottom, #d3d3d3, #a9a9a9);
  animation: cloudyEffect 20s linear infinite;
}

.snow-background {
  background: linear-gradient(to bottom, #e8e8e8, #f8f8f8);
  position: relative;
  overflow: hidden;
}

.snow-background::before {
  content: '';
  position: fixed;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, white 2px, transparent 3px);
  background-size: 50px 50px;
  animation: snowEffect 10s linear infinite;
  pointer-events: none;
  backface-visibility: hidden;
  will-change: transform;
}

.thunderstorm-background {
  background: linear-gradient(to bottom, #1a1a1a, #2c3e50);
  position: relative;
  overflow: hidden;
}

.thunderstorm-background::before {
  content: '';
  position: fixed;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    transparent,
    rgba(255, 255, 255, 0.2) 10px,
    transparent 20px
  );
  animation: rainEffect 1s linear infinite;
  pointer-events: none;
  backface-visibility: hidden;
  will-change: transform;
}

.thunderstorm-background::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  animation: lightningEffect 5s infinite;
  pointer-events: none;
}

@keyframes sunnyEffect {
  0% { 
    background-position: 0% 50%;
    transform: translateZ(0);
  }
  50% {
    background-position: 100% 50%;
  }
  100% { 
    background-position: 0% 50%;
    transform: translateZ(0);
  }
}

@keyframes rainEffect {
  0% { transform: translateY(-100%) translateZ(0); }
  100% { transform: translateY(100%) translateZ(0); }
}

@keyframes cloudyEffect {
  0% { 
    opacity: 0.8;
    transform: translateZ(0);
  }
  50% {
    opacity: 1;
  }
  100% { 
    opacity: 0.8;
    transform: translateZ(0);
  }
}

@keyframes snowEffect {
  0% { transform: translateY(-100%) translateZ(0) rotate(0deg); }
  100% { transform: translateY(100%) translateZ(0) rotate(360deg); }
}

@keyframes lightningEffect {
  0%, 95%, 98% {
    background: transparent;
  }
  96%, 99% {
    background: rgba(255, 255, 255, 0.95);
  }
  97%, 100% {
    background: transparent;
  }
}
</style> 
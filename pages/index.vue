<template>
  <div>
    <h1>Weather App</h1>
    <form @submit.prevent="getWeather">
      <input
        v-model="city"
        type="text"
        placeholder="Enter city name"
        required
      />
      <button type="submit">Get Weather</button>
    </form>
    <div v-if="error" style="color: red">
      <p>{{ error }}</p>
    </div>
    <div v-if="weather">
      <h2>Weather in {{ weather.name }}</h2>
      <p>Temperature: {{ weather.main.temp }}°C</p>
      <p>Weather: {{ weather.weather[0].description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useWeather } from '~/composables/useWeather';

  const city = ref('');
  const { weather, error, fetchWeather, fetchForecast, forecast } =
    useWeather();

  const getWeather = async () => {
    error.value = '';
    weather.value = null;
    if (city.value) {
      await fetchWeather(city.value);
      await fetchForecast(city.value);
    }
  };
</script>

<style scoped>
  div {
    text-align: center;
    margin: 20px;
    font-family: Arial, sans-serif;
  }
  input {
    padding: 10px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
  button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
  h1 {
    margin-bottom: 20px;
  }
  h2 {
    margin-top: 20px;
  }
  p {
    margin: 5px 0;
  }
</style>

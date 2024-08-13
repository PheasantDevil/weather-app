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
      <h2>Current Weather in {{ weather.name }}</h2>
      <p>Temperature: {{ weather.main.temp }}°C</p>
      <p>Weather: {{ weather.weather[0].description }}</p>
    </div>
    <div v-if="groupedForecast">
      <h2>5-Day Forecast</h2>
      <div
        v-for="(items, date) in groupedForecast"
        :key="date"
        class="forecast-day"
      >
        <h3>{{ formatDate(date) }}</h3>
        <div v-for="item in items" :key="item.dt" class="forecast-item">
          <p>
            {{ formatTime(item.dt_txt) }} - Temp: {{ item.main.temp }}°C -
            {{ item.weather[0].description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useWeather } from '~/composables/useWeather';

  const city = ref('');
  const { weather, error, fetchWeather, fetchForecast, forecast } =
    useWeather();

  const groupedForecast = ref<any>({});

  const groupForecastByDate = () => {
    if (forecast.value) {
      groupedForecast.value = forecast.value.list.reduce(
        (acc: any, item: any) => {
          const date = item.dt_txt.split(' ')[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(item);
          return acc;
        },
        {}
      );
    }
  };

  const getWeather = async () => {
    error.value = '';
    weather.value = null;
    groupedForecast.value = {};
    if (city.value) {
      await fetchWeather(city.value);
      await fetchForecast(city.value);
      groupForecastByDate();
    }
  };

  const formatDate = (dateString: string) => {
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (dateTimeString: string) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', options);
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
  .forecast-item {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    margin: 10px 0;
    background-color: #f9f9f9;
  }
</style>

<template>
  <div>
    <h1>{{ $t('weatherApp') }}</h1>
    <form @submit.prevent="getWeather">
      <input v-model="city" :placeholder="$t('enterCity')" required />
      <button type="submit">{{ $t('getWeather') }}</button>
    </form>
    <div v-if="error" style="color: red">
      <p>{{ $t('error') }}: {{ error }}</p>
    </div>
    <div v-if="weather">
      <h2>{{ $t('currentWeather') }} {{ weather.name }}</h2>
      <p>{{ $t('temperature') }}: {{ weather.main.temp }}°C</p>
      <p>{{ $t('weather') }}: {{ weather.weather[0].description }}</p>
    </div>
    <div v-if="groupedForecast">
      <h2>{{ $t('forecast') }}</h2>
      <div
        v-for="(data, date) in groupedForecast"
        :key="date"
        class="forecast-day"
      >
        <h3>{{ formatDate(date) }}</h3>
        <img
          :src="`https://openweathermap.org/img/wn/${data.icon}@2x.png`"
          alt="Weather icon"
        />
        <div v-for="item in data.items" :key="item.dt" class="forecast-item">
          <p>
            {{ formatTime(item.dt_txt) }} - {{ $t('temperature') }}:
            {{ item.main.temp }}°C - {{ item.weather[0].description }}
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
            acc[date] = {
              icon: item.weather[0].icon, // 最初の時間帯のアイコンを使用
              items: [],
            };
          }
          acc[date].items.push(item);
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
  .forecast-day {
    margin-bottom: 20px;
  }
  .forecast-day img {
    vertical-align: middle;
    margin-right: 10px;
  }
  .forecast-item {
    margin-left: 20px;
  }
</style>

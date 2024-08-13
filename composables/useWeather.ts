import { ref } from 'vue';

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

export function useWeather() {
  const weather = ref(null);
  const forecast = ref(null);
  const error = ref('');

  const fetchWeather = async (city: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error('City not found');
      }
      weather.value = await response.json();
    } catch (err) {
      error.value = 'Failed to fetch weather data. Please try again.';
    }
  };

  const fetchForecast = async (city: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error('City not found');
      }
      forecast.value = await response.json();
    } catch (err) {
      error.value = 'Failed to fetch forecast data. Please try again.';
    }
  };

  return {
    weather,
    forecast,
    error,
    fetchWeather,
    fetchForecast,
  };
}

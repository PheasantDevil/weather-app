import { ref } from 'vue';

const API_KEY = 'ee6cfcb0e9c0f7601a366ae55bfdf4a5';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const GEO_NAMES_USERNAME = 'konishikenji';
const GEO_NAMES_URL = 'https://secure.geonames.org/searchJSON';

export function useWeather() {
  const weather = ref(null);
  const forecast = ref(null);
  const error = ref('');

  const fetchGeoNamesData = async (city: string) => {
    try {
      const response = await fetch(
        `${GEO_NAMES_URL}?q=${encodeURIComponent(
          city
        )}&username=${GEO_NAMES_USERNAME}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.geonames || data.geonames.length === 0) {
        throw new Error('City not found in GeoNames');
      }
      return data.geonames[0]?.name;
    } catch (err) {
      console.error('Error fetching GeoNames data:', err);
      throw err;
    }
  };

  const fetchWeather = async (city: string) => {
    try {
      const englishCityName = await fetchGeoNamesData(city);
      const response = await fetch(
        `${BASE_URL}weather?q=${englishCityName}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      weather.value = await response.json();
    } catch (err) {
      console.error('Error fetching weather data:', err);
      error.value = 'Failed to fetch weather data. Please try again.';
      throw err;
    }
  };

  const fetchForecast = async (city: string) => {
    try {
      const englishCityName = await fetchGeoNamesData(city);
      const response = await fetch(
        `${BASE_URL}forecast?q=${englishCityName}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      forecast.value = await response.json();
    } catch (err) {
      console.error('Error fetching forecast data:', err);
      error.value = 'Failed to fetch forecast data. Please try again.';
      throw err;
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

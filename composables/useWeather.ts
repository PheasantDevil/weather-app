import { ref } from 'vue';

const API_KEY = 'ee6cfcb0e9c0f7601a366ae55bfdf4a5';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const GEO_NAMES_USERNAME = 'konishikenji'; // GeoNamesのユーザー名
const GEO_NAMES_URL = 'http://api.geonames.org/searchJSON';

export function useWeather() {
  const weather = ref(null);
  const forecast = ref(null);
  const error = ref('');

  const fetchGeoNamesData = async (city: string) => {
    const response = await fetch(
      `${GEO_NAMES_URL}?q=${encodeURIComponent(
        city
      )}&username=${GEO_NAMES_USERNAME}`
    );
    if (!response.ok) {
      throw new Error('City not found in GeoNames');
    }
    const data = await response.json();
    return data.geonames[0]?.name; // 最初の結果の英語名を返す
  };

  const fetchWeather = async (city: string) => {
    try {
      const englishCityName = await fetchGeoNamesData(city); // 漢字を英語名に変換

      const response = await fetch(
        `${BASE_URL}weather?q=${englishCityName}&appid=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error('City not found in OpenWeatherMap');
      }
      weather.value = await response.json();
    } catch (err) {
      error.value = 'Failed to fetch weather data. Please try again.';
    }
  };

  const fetchForecast = async (city: string) => {
    try {
      const englishCityName = await fetchGeoNamesData(city); // 漢字を英語名に変換
      const response = await fetch(
        `${BASE_URL}forecast?q=${englishCityName}&appid=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error('City not found in OpenWeatherMap');
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

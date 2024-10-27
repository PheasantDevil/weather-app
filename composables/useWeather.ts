import { ref, computed } from 'vue';
import { groupForecastByDate } from '~/utils/weatherUtils';
import type { WeatherData, ForecastData, GroupedForecast } from '~/types/weather';

const API_KEY = 'ee6cfcb0e9c0f7601a366ae55bfdf4a5';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const GEO_NAMES_USERNAME = 'konishikenji';
const GEO_NAMES_URL = 'https://secure.geonames.org/searchJSON';

export function useWeather() {
  const weather = ref<WeatherData | null>(null);
  const forecast = ref<ForecastData | null>(null);
  const error = ref('');
  const isLoading = ref(false);

  const groupedForecast = computed<GroupedForecast | null>(() => {
    return forecast.value ? groupForecastByDate(forecast.value) : null;
  });

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

  const fetchWeatherData = async (city: string) => {
    isLoading.value = true;
    error.value = '';
    try {
      const englishCityName = await fetchGeoNamesData(city);
      
      // 天気データの取得
      const weatherResponse = await fetch(
        `${BASE_URL}weather?q=${englishCityName}&appid=${API_KEY}&units=metric`
      );
      if (!weatherResponse.ok) {
        throw new Error(`HTTP error! status: ${weatherResponse.status}`);
      }
      weather.value = await weatherResponse.json();

      // 予報データの取得
      const forecastResponse = await fetch(
        `${BASE_URL}forecast?q=${englishCityName}&appid=${API_KEY}&units=metric`
      );
      if (!forecastResponse.ok) {
        throw new Error(`HTTP error! status: ${forecastResponse.status}`);
      }
      forecast.value = await forecastResponse.json();
    } catch (err) {
      console.error('Error fetching weather data:', err);
      error.value = 'Failed to fetch weather data. Please try again.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    weather,
    forecast,
    groupedForecast,
    error,
    isLoading,
    fetchWeatherData,
  };
}

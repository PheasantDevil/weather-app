import { ref } from 'vue';
import type { WeatherError } from '~/types/weather';
import { API_CONSTANTS } from '~/constants/api';

export function useWeatherApi() {
  const isLoading = ref(false);
  const error = ref<WeatherError | null>(null);

  const fetchWithErrorHandling = async <T>(
    url: string,
    options?: RequestInit
  ): Promise<T> => {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      const error: WeatherError = {
        code: 'API_ERROR',
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        details: err,
      };
      throw error;
    }
  };

  const buildWeatherUrl = (city: string): string => {
    const params = new URLSearchParams({
      q: city,
      appid: useRuntimeConfig().public.weatherApiKey,
      units: API_CONSTANTS.WEATHER.UNITS,
    });
    return `${API_CONSTANTS.WEATHER.BASE_URL}/weather?${params}`;
  };

  const buildForecastUrl = (city: string): string => {
    const params = new URLSearchParams({
      q: city,
      appid: useRuntimeConfig().public.weatherApiKey,
      units: API_CONSTANTS.WEATHER.UNITS,
    });
    return `${API_CONSTANTS.WEATHER.BASE_URL}/forecast?${params}`;
  };

  return {
    isLoading,
    error,
    fetchWithErrorHandling,
    buildWeatherUrl,
    buildForecastUrl,
  };
}

import type {
  ForecastData,
  ForecastItem,
  GroupedForecast,
} from '~/types/weather';

export const groupForecastByDate = (
  forecast: ForecastData
): GroupedForecast => {
  return forecast.list.reduce((acc: GroupedForecast, item: ForecastItem) => {
    const date = item.dt_txt.split(' ')[0];

    if (!acc[date]) {
      acc[date] = {
        icon: item.weather[0].icon,
        items: [],
        averageTemp: 0,
      };
    }

    acc[date].items.push(item);

    // Calculate average temperature for the day
    acc[date].averageTemp =
      acc[date].items.reduce((sum, curr) => sum + curr.main.temp, 0) /
      acc[date].items.length;

    return acc;
  }, {});
};

export const getWeatherIconUrl = (icon: string): string => {
  return `${API_CONSTANTS.WEATHER.ICON_BASE_URL}/${icon}@2x.png`;
};

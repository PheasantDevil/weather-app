export interface WeatherCondition {
  description: string;
  icon: string;
}

export interface Temperature {
  temp: number;
  feels_like?: number;
  temp_min?: number;
  temp_max?: number;
  humidity?: number;
  pressure?: number;
}

export interface WeatherData {
  name: string;
  main: Temperature;
  weather: WeatherCondition[];
  dt: number;
}

export interface ForecastItem extends Omit<WeatherData, 'name'> {
  dt_txt: string;
}

export interface ForecastData {
  city: {
    name: string;
    country: string;
  };
  list: ForecastItem[];
}

export interface GroupedForecast {
  [date: string]: {
    icon: string;
    items: ForecastItem[];
    averageTemp: number;
  };
}

export type WeatherError = {
  code: string;
  message: string;
  details?: unknown;
};

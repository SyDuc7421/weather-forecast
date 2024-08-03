export type weatherProps = {
  time: string;
  temp_c: number;
  is_day: 0 | 1;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  wind_kph: number;
  wind_dir: string;
  pressure_mb: number;
  humidity: number;
  cloud: number;
  uv: number;
};

export type locationProps = {
  name: string;
  country: string;
  localtime: string;
};

export type avarageWeatherProps = {
  maxtemp_c: number;
  mintemp_c: number;
  avgtemp_c: number;
  totalprecip_mm: number;
  avghumidity: number;
  daily_chance_of_rain: number;
  uv: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
};

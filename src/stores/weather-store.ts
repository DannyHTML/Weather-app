import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

import fog from '@/assets/images/fog.webp';
import overcast from '@/assets/images/overcast.webp';
import partly_cloudy from '@/assets/images/partly_cloudy.webp';
import rain_heavy from '@/assets/images/rain_heavy.webp';
import rain from '@/assets/images/rain.webp';
import snow from '@/assets/images/snow.webp';
import sunny from '@/assets/images/sunny.webp';
import thunder from '@/assets/images/thunder.webp';

export const useWeatherStore = defineStore('weather', () => {
    const weatherData = ref<any | null>(null);

    const getCity = ref<string>('');
    const getCountry = ref<string>('');

    const weatherTemp = ref<number>(0);
    const apparentTemperature = ref<number>(0);
    const humidity = ref<number>(0);
    const windSpeed = ref<number>(0);
    const precipitation = ref<number>(0);

    const unitSystem = ref<'metric' | 'imperial'>('metric');
    const loading = ref<boolean>(false);
    const errorInput = ref<boolean>(false);
    const error = ref<boolean>(false);

    const timezone = ref<string>('');
    const ISOCode = ref<string>('');

    const todayForecast = ref<any | null>(null);
    const selectedHourlyForecastDay = ref<string>('');

    // Weather icons
    const weatherIcons: Record<string, string> = {
        fog,
        overcast,
        partly_cloudy,
        rain_heavy,
        rain,
        snow,
        sunny,
        thunder,
    };

    // Units

    const tempUnit = computed(() => (unitSystem.value === 'metric' ? '°' : '°F'));
    const windUnit = computed(() => (unitSystem.value === 'metric' ? 'km/h' : 'mph'));
    const precipitationUnit = computed(() => (unitSystem.value === 'metric' ? 'mm' : 'inches'));

    const temperatureDisplay = computed(() =>
        unitSystem.value === 'metric' ? weatherTemp.value : (weatherTemp.value * 9) / 5 + 32
    );

    const apparentTemperatureDisplay = computed(() =>
        unitSystem.value === 'metric'
            ? apparentTemperature.value
            : (apparentTemperature.value * 9) / 5 + 32
    );

    const windSpeedDisplay = computed(() =>
        unitSystem.value === 'metric' ? windSpeed.value : windSpeed.value * 2.23694
    );

    const precipitationDisplay = computed(() =>
        unitSystem.value === 'metric' ? precipitation.value : precipitation.value / 25.4
    );

    // WEATHER CODE → ICON function
    // TODO: I need to add more icons later, like rain and rain heavy for example
    function mapWeatherCodeToIcon(code: number): string {
        switch (code) {
            case 0:
                return 'sunny';
            case 1:
                return 'mostly_clear';
            case 2:
                return 'partly_cloudy';
            case 3:
                return 'overcast';
            case 45:
            case 48:
                return 'fog';
            case 51:
            case 53:
            case 55:
            case 56:
            case 57:
            case 61:
            case 63:
            case 65:
            case 66:
            case 67:
                return 'rain';
            case 80:
            case 81:
            case 82:
                return 'rain_heavy';
            case 71:
            case 73:
            case 75:
            case 77:
                return 'snow';
            case 85:
            case 86:
                return 'snow_shower';
            case 95:
                return 'storm';
            case 96:
            case 99:
                return 'storm_hail';
            default:
                return 'overcast';
        }
    }

    // TODAY INFO

    const todayWeekday = computed(() => {
        if (!todayForecast.value) return '';
        return new Date(todayForecast.value.date).toLocaleDateString('en-US', {
            weekday: 'long',
        });
    });

    const todayIcon = computed(() => {
        if (!todayForecast.value) return weatherIcons.overcast;
        const iconName = mapWeatherCodeToIcon(todayForecast.value.weatherCode);
        return weatherIcons[iconName] || weatherIcons.overcast;
    });

    // WEEKLY FORECAST

    interface WeeklyForecastDay {
        date: string;
        weekdayShort: string;
        weekdayLong: string;
        tempMax: number;
        tempMin: number;
        icon: string;
        weatherCode: number;
    }

    const weeklyForecast = computed<WeeklyForecastDay[]>(() => {
        if (!weatherData.value?.daily) return [];

        const daily = weatherData.value.daily;
        const tz = weatherData.value.timezone;

        return daily.time.map((date: string, index: number) => {
            const weatherCode = daily.weather_code[index];
            const iconName = mapWeatherCodeToIcon(weatherCode);

            return {
                date,
                weekdayShort: new Date(date).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    timeZone: tz,
                }),
                weekdayLong: new Date(date).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    timeZone: tz,
                }),
                tempMax: daily.temperature_2m_max[index],
                tempMin: daily.temperature_2m_min[index],
                icon: weatherIcons[iconName] || weatherIcons.overcast,
                weatherCode,
            };
        });
    });

    const hourlyForecastWeekDays = computed(() => {
        return weeklyForecast.value.map((day) => day.weekdayLong);
    });

    // TODO: Fix hourly forecast to show next 8 hours from current time. It starts showing from 00:00 instead of the current time.
    const next8HoursForecast = computed(() => {
        if (!weatherData.value?.hourly || !weatherData.value.current_weather) return [];

        const hourly = weatherData.value.hourly;
        const times = hourly.time.map((t: string) => new Date(t));
        const now = new Date(weatherData.value.current_weather.time);

        // Find the index of the next hour from now
        let startIndex = times.findIndex((t: Date) => t.getTime() >= now.getTime());
        if (startIndex === -1) startIndex = 0;

        // Filter indexes for selected day if needed
        const filteredIndexes = [];
        for (let i = startIndex; i < times.length; i++) {
            const t = times[i];
            const weekday = t.toLocaleDateString('en-US', { weekday: 'long' });

            if (!selectedHourlyForecastDay.value || weekday === selectedHourlyForecastDay.value) {
                filteredIndexes.push(i);
            }

            if (filteredIndexes.length >= 8) break; // only next 8 hours
        }

        return filteredIndexes.map((idx) => {
            const time = times[idx];
            const weatherCode = hourly.weather_code?.[idx] ?? 0;
            const iconName = mapWeatherCodeToIcon(weatherCode);

            return {
                time: time.toISOString(),
                temperature: hourly.temperature_2m[idx],
                apparentTemperature: hourly.apparent_temperature[idx],
                humidity: hourly.relative_humidity_2m[idx],
                precipitation: hourly.precipitation[idx],
                windspeed: hourly.windspeed_10m[idx],
                weekday: time.toLocaleDateString('en-US', { weekday: 'long' }),
                icon: weatherIcons[iconName] || weatherIcons.overcast,
            };
        });
    });

    // FETCH WEATHER

    // TODO: Need to make sure the amount of requests to the API is low.
    // TODO: Consider caching results for previously searched cities to reduce API calls. HOW, GOOGLE?
    // TODO: Implent template literal types for unitSystem to avoid invalid values, maybe?
    // TODO: Fix fetchWeather to avoid multiple requests when searching for the same city repeatedly.

    // TODO: Need to click twice on mobile to open the dropdown. Issue with touch events?. Needs fixing.
    // TODO: Fix Units dropdown, units needs to work separately.
    async function fetchWeather(city: string) {
        loading.value = true;
        errorInput.value = false;

        try {
            const geoRes = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
                params: { name: city, count: 1 },
            });

            if (!geoRes.data.results?.length) {
                errorInput.value = true;
                console.error('City not found');
                return;
            }

            const { latitude, longitude, country } = geoRes.data.results[0];

            const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
                params: {
                    latitude,
                    longitude,
                    current_weather: true,
                    hourly: 'temperature_2m,relative_humidity_2m,precipitation,apparent_temperature,windspeed_10m',
                    daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,windspeed_10m_max',
                    timezone: 'auto',
                },
            });

            weatherData.value = response.data;

            const data = response.data;

            getCity.value = city;
            getCountry.value = country;

            timezone.value = data.current_weather.time;
            ISOCode.value = data.current_weather_units.time;

            // Current weather
            weatherTemp.value = data.current_weather.temperature;
            windSpeed.value = data.current_weather.windspeed;

            const currentTime = new Date(data.current_weather.time);
            const hourlyTimes = data.hourly.time.map((t: string) => new Date(t));

            const currentIndex = hourlyTimes.findIndex(
                (t: Date) =>
                    t.getUTCFullYear() === currentTime.getUTCFullYear() &&
                    t.getUTCMonth() === currentTime.getUTCMonth() &&
                    t.getUTCDate() === currentTime.getUTCDate() &&
                    t.getUTCHours() === currentTime.getUTCHours()
            );

            todayForecast.value = {
                date: data.daily.time[0],
                tempMax: data.daily.temperature_2m_max[0],
                tempMin: data.daily.temperature_2m_min[0],
                apparentMax: data.daily.apparent_temperature_max[0],
                apparentMin: data.daily.apparent_temperature_min[0],
                weatherCode: data.daily.weather_code[0],
            };

            // Hourly extras
            apparentTemperature.value =
                currentIndex !== -1 ? data.hourly.apparent_temperature[currentIndex] : 0;

            humidity.value =
                currentIndex !== -1 ? data.hourly.relative_humidity_2m[currentIndex] : 0;

            precipitation.value = currentIndex !== -1 ? data.hourly.precipitation[currentIndex] : 0;

            windSpeed.value =
                currentIndex !== -1 ? data.hourly.windspeed_10m[currentIndex] : windSpeed.value;
        } catch (err: any) {
            console.error(err);
            error.value = true;
        } finally {
            loading.value = false;
        }
    }

    // Fetch weather by coordinates (for current location)
    async function fetchWeatherByCoords(lat: number, lon: number) {
        loading.value = true;
        error.value = false;

        try {
            const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
                params: {
                    latitude: lat,
                    longitude: lon,
                    current_weather: true,
                    hourly: 'temperature_2m,relative_humidity_2m,precipitation,apparent_temperature,windspeed_10m',
                    daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,windspeed_10m_max',
                    timezone: 'auto',
                },
            });

            weatherData.value = response.data;
            const data = response.data;

            // Set city + country (reverse geocode)
            const reverse = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
                params: { lat, lon, format: 'json' },
            });

            getCity.value =
                reverse.data.address.city ||
                reverse.data.address.town ||
                reverse.data.address.village ||
                '';
            getCountry.value = reverse.data.address.country || '';

            timezone.value = data.current_weather.time;
            ISOCode.value = data.current_weather_units.time;

            // Same parsing logic as your fetchWeather()
            weatherTemp.value = data.current_weather.temperature;
            windSpeed.value = data.current_weather.windspeed;

            const currentTime = new Date(data.current_weather.time);
            const hourlyTimes = data.hourly.time.map((t: string) => new Date(t));

            const currentIndex = hourlyTimes.findIndex(
                (t: Date) =>
                    t.getUTCFullYear() === currentTime.getUTCFullYear() &&
                    t.getUTCMonth() === currentTime.getUTCMonth() &&
                    t.getUTCDate() === currentTime.getUTCDate() &&
                    t.getUTCHours() === currentTime.getUTCHours()
            );

            todayForecast.value = {
                date: data.daily.time[0],
                tempMax: data.daily.temperature_2m_max[0],
                tempMin: data.daily.temperature_2m_min[0],
                apparentMax: data.daily.apparent_temperature_max[0],
                apparentMin: data.daily.apparent_temperature_min[0],
                weatherCode: data.daily.weather_code[0],
            };

            apparentTemperature.value =
                currentIndex !== -1 ? data.hourly.apparent_temperature[currentIndex] : 0;

            humidity.value =
                currentIndex !== -1 ? data.hourly.relative_humidity_2m[currentIndex] : 0;

            precipitation.value = currentIndex !== -1 ? data.hourly.precipitation[currentIndex] : 0;

            windSpeed.value =
                currentIndex !== -1 ? data.hourly.windspeed_10m[currentIndex] : windSpeed.value;
        } catch (err) {
            console.error(err);
            error.value = true;
        } finally {
            loading.value = false;
        }
    }

    return {
        loading,
        error,
        errorInput,

        fetchWeather,
        fetchWeatherByCoords,

        getCity,
        getCountry,
        timezone,
        ISOCode,

        weatherTemp,
        apparentTemperature,
        humidity,
        windSpeed,
        precipitation,

        temperatureDisplay,
        apparentTemperatureDisplay,
        windSpeedDisplay,
        precipitationDisplay,

        unitSystem,
        tempUnit,
        windUnit,
        precipitationUnit,

        todayForecast,
        todayWeekday,
        todayIcon,
        hourlyForecastWeekDays,

        weeklyForecast,
        selectedHourlyForecastDay,
        next8HoursForecast,
    };
});

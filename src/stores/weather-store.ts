import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

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
    const error = ref<string | null>(null);

    const timezone = ref<string>('');
    const ISOCode = ref<string>('');

    const todayForecast = ref<any | null>(null);

    // --------------------------------------------------
    // Units
    // --------------------------------------------------

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

    // --------------------------------------------------
    // WEATHER CODE → ICON
    // --------------------------------------------------

    function mapWeatherCodeToIcon(code: number): string {
        // TODO: I need to add more icons later, like rain and rain heavy for example
        if (code === 0) return 'sunny';
        if (code === 1) return 'mostly_clear';
        if (code === 2) return 'partly_cloudy';
        if (code === 3) return 'overcast';

        if (code === 45 || code === 48) return 'fog';

        if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67].includes(code)) return 'rain';

        if ([80, 81, 82].includes(code)) return 'rain_heavy';

        if ([71, 73, 75, 77].includes(code)) return 'snow';
        if ([85, 86].includes(code)) return 'snow_shower';

        if (code === 95) return 'storm';
        if (code === 96 || code === 99) return 'storm_hail';

        return 'unknown';
    }

    // --------------------------------------------------
    // TODAY INFO
    // --------------------------------------------------

    const todayWeekday = computed(() => {
        if (!todayForecast.value) return '';
        return new Date(todayForecast.value.date).toLocaleDateString('en-US', {
            weekday: 'long',
        });
    });

    const todayIcon = computed(() => {
        if (!todayForecast.value) return '/src/assets/images/unknown.webp';
        const iconName = mapWeatherCodeToIcon(todayForecast.value.weatherCode);
        return `/src/assets/images/${iconName}.webp`;
    });

    // --------------------------------------------------
    // WEEKLY FORECAST  (THIS WAS BROKEN BEFORE)
    // --------------------------------------------------

    const weeklyForecast = computed(() => {
        if (!weatherData.value?.daily) return [];

        const daily = weatherData.value.daily;

        return daily.time.map((date: string, index: number) => {
            const weatherCode = daily.weather_code[index];
            const iconName = mapWeatherCodeToIcon(weatherCode);

            return {
                date,
                weekday: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                tempMax: daily.temperature_2m_max[index],
                tempMin: daily.temperature_2m_min[index],
                icon: `/src/assets/images/${iconName}.webp`,
                weatherCode,
            };
        });
    });

    // --------------------------------------------------
    // FETCH WEATHER
    // --------------------------------------------------

    async function fetchWeather(city: string) {
        loading.value = true;
        error.value = null;

        try {
            const geoRes = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
                params: { name: city, count: 1 },
            });

            if (!geoRes.data.results?.length) {
                throw new Error(`City "${city}" not found`);
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

            // Store full data
            weatherData.value = response.data;
            console.log(weeklyForecast.value);

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
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    // --------------------------------------------------
    // EXPORT STORE
    // --------------------------------------------------

    return {
        loading,
        error,

        fetchWeather,

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

        weeklyForecast,
    };
});

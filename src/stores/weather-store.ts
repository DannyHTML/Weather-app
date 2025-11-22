import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useWeatherStore = defineStore('weather', () => {
    const weatherData = ref(null);
    const getCity = ref<string>('');
    const getCountry = ref<string>('');
    const weatherTemp = ref<number>(0);
    const apparentTemperature = ref<number>(0);
    const humidity = ref<number>(0);
    const windSpeed = ref<number>(0);
    const precipitation = ref<number>(0);
    const unitSystem = ref<'metric' | 'imperial'>('metric'); // new toggle
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const timezone = ref<string>('');
    const ISOCode = ref<string>('');

    // Computed units
    const tempUnit = computed(() => (unitSystem.value === 'metric' ? '°C' : '°F'));
    const windUnit = computed(() => (unitSystem.value === 'metric' ? 'km/h' : 'mph'));
    const precipitationUnit = computed(() => (unitSystem.value === 'metric' ? 'mm' : 'inches'));

    const tempUnitSystem = ref<'metric' | 'imperial'>('metric');
    const windUnitSystem = ref<'metric' | 'imperial'>('metric');
    const precipitationUnitSystem = ref<'metric' | 'imperial'>('metric');

    // Computed converted values
    const temperatureDisplay = computed(() =>
        tempUnitSystem.value === 'metric' ? weatherTemp.value : (weatherTemp.value * 9) / 5 + 32
    );
    const apparentTemperatureDisplay = computed(() =>
        tempUnitSystem.value === 'metric'
            ? apparentTemperature.value
            : (apparentTemperature.value * 9) / 5 + 32
    );

    const windSpeedDisplay = computed(() =>
        windUnitSystem.value === 'metric' ? windSpeed.value : windSpeed.value * 2.23694
    );

    const precipitationDisplay = computed(() =>
        precipitationUnitSystem.value === 'metric'
            ? precipitation.value
            : precipitation.value / 25.4
    );

    async function fetchWeather(city: string) {
        loading.value = true;
        error.value = null;

        try {
            // Step 1: Get coordinates
            const geoRes = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
                params: { name: city, count: 1 },
            });
            // test

            if (!geoRes.data.results || geoRes.data.results.length === 0) {
                throw new Error(`City "${city}" not found`);
            }

            const { latitude, longitude, country } = geoRes.data.results[0];

            // Step 2: Fetch forecast
            const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
                params: {
                    latitude,
                    longitude,
                    current_weather: true,
                    hourly: 'temperature_2m,relative_humidity_2m,precipitation,apparent_temperature,windspeed_10m',
                },
            });

            const data = response.data;
            getCity.value = city;
            getCountry.value = country;
            timezone.value = data.current_weather.time;
            ISOCode.value = data.current_weather_units.time;

            // Current temperature and wind speed
            weatherTemp.value = data.current_weather.temperature;
            windSpeed.value = data.current_weather.windspeed;

            // Map current hour to hourly arrays
            const currentTime = new Date(data.current_weather.time);
            const hourlyTimes = data.hourly.time.map((t: string) => new Date(t));

            const currentIndex = hourlyTimes.findIndex(
                (t: Date) =>
                    t.getUTCFullYear() === currentTime.getUTCFullYear() &&
                    t.getUTCMonth() === currentTime.getUTCMonth() &&
                    t.getUTCDate() === currentTime.getUTCDate() &&
                    t.getUTCHours() === currentTime.getUTCHours()
            );

            // Extract current values
            apparentTemperature.value =
                currentIndex !== -1 ? data.hourly.apparent_temperature[currentIndex] : 0;
            humidity.value =
                currentIndex !== -1 ? data.hourly.relative_humidity_2m[currentIndex] : 0;
            precipitation.value = currentIndex !== -1 ? data.hourly.precipitation[currentIndex] : 0;
            windSpeed.value =
                currentIndex !== -1 && data.hourly.windspeed_10m
                    ? data.hourly.windspeed_10m[currentIndex]
                    : windSpeed.value;
        } catch (err: any) {
            console.error('Error fetching weather data:', err);
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    return {
        weatherData,
        loading,
        fetchWeather,
        getCity,
        getCountry,
        timezone,
        ISOCode,
        error,
        unitSystem,
        // raw values
        weatherTemp,
        apparentTemperature,
        humidity,
        windSpeed,
        precipitation,
        // computed displays
        temperatureDisplay,
        apparentTemperatureDisplay,
        windSpeedDisplay,
        precipitationDisplay,
        tempUnit,
        windUnit,
        precipitationUnit,
        tempUnitSystem,
        windUnitSystem,
        precipitationUnitSystem,
    };
});

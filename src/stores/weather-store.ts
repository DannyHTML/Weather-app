import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useWeatherStore = defineStore('weather', () => {
    const weatherData = ref(null);
    const getCity = ref<string>('');
    const getCountry = ref<string>('');
    const weatherTemp = ref<number>(0);
    const apparentTemperature = ref<number>(0);
    const windSpeed = ref<number>(0);
    const weatherUnit = ref<string>('');
    const ISOCode = ref<string>('');
    const timezone = ref<string>('');
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);

    // TODO: MAKE NEW ISSUE!
    // TODO: Based on toggle dropdown, change the unit from metric to imperial
    // const currentWeatherTempF = computed(() => {
    //     return (currentWeatherTemp.value * 9) / 5 + 32;
    // });

    async function fetchWeather(city: string) {
        loading.value = true;
        error.value = null;

        try {
            // Step 1: Get coordinates from city name
            const geoRes = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
                params: { name: city, count: 1 },
            });

            if (!geoRes.data.results || geoRes.data.results.length === 0) {
                throw new Error(`City "${city}" not found`);
            }

            const { latitude, longitude, country } = geoRes.data.results[0];

            // Step 2: Fetch forecast using coordinates
            const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
                params: {
                    latitude,
                    longitude,
                    current_weather: true,
                    hourly: 'temperature_2m,relative_humidity_2m,precipitation,apparent_temperature',
                },
            });

            const data = response.data;

            getCity.value = city;
            getCountry.value = country;

            // TODO: Fix the wind speed unit issue and correct data for the 4 block layout

            // Current temperature
            weatherTemp.value = data.current_weather.temperature;
            weatherUnit.value = data.current_weather_units.temperature;
            ISOCode.value = data.current_weather_units.time;
            timezone.value = data.current_weather.time;

            // Extract current apparent temperature from hourly array
            const currentTime = new Date(data.current_weather.time);
            const hourlyTimes = data.hourly.time.map((t: string) => new Date(t));

            // Find the index of the hourly time that matches the current hour
            const currentIndex = hourlyTimes.findIndex(
                (t: Date) =>
                    t.getUTCFullYear() === currentTime.getUTCFullYear() &&
                    t.getUTCMonth() === currentTime.getUTCMonth() &&
                    t.getUTCDate() === currentTime.getUTCDate() &&
                    t.getUTCHours() === currentTime.getUTCHours()
            );

            apparentTemperature.value =
                currentIndex !== -1 ? data.hourly.apparent_temperature[currentIndex] : 0;

            console.log('Weather data:', data);
            console.log('Current apparent temperature:', apparentTemperature.value);
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
        weatherTemp,
        weatherUnit,
        getCity,
        timezone,
        ISOCode,
        error,
        getCountry,
        windSpeed,
        apparentTemperature,
    };
});

import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useWeatherStore = defineStore('weather', () => {
    const weatherData = ref(null);
    const getCity = ref('');
    const getCountry = ref('');
    const currentWeatherTemp = ref('');
    const currentWeatherUnit = ref('');
    const currentISOCode = ref('');
    const currentTimezone = ref('');
    const loading = ref(false);
    const error = ref<string | null>(null);

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
            console.log('Geocoding response:', geoRes.data);
            console.log(`Coordinates for ${city}:`, latitude, longitude, country);

            // Step 2: Fetch forecast using coordinates
            const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
                params: {
                    latitude,
                    longitude,
                    current_weather: true,
                    hourly: 'temperature_2m,relative_humidity_2m',
                },
            });
            console.log('Weather API response:', response);

            weatherData.value = response.data;
            console.log('Fetched weather data:', response.data);
            getCity.value = city;
            getCountry.value = country;
            currentWeatherTemp.value = response.data.current_weather.temperature;
            currentWeatherUnit.value = response.data.current_weather_units.temperature;
            currentISOCode.value = response.data.current_weather_units.time;
            currentTimezone.value = response.data.current_weather.time;
            console.log(currentISOCode.value, currentTimezone.value);
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
        currentWeatherTemp,
        currentWeatherUnit,
        getCity,
        currentTimezone,
        currentISOCode,
        error,
        getCountry,
    };
});

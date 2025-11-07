import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useWeatherStore = defineStore('weather', () => {
    const weatherData = ref(null);
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

            const { latitude, longitude } = geoRes.data.results[0];

            // Step 2: Fetch forecast using coordinates
            const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
                params: {
                    latitude,
                    longitude,
                    current_weather: true,
                    hourly: 'temperature_2m,relative_humidity_2m',
                },
            });

            weatherData.value = response.data;
            console.log('Weather data:', weatherData.value);
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
    };
});

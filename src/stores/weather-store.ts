import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useWeatherStore = defineStore('weather', () => {
    const weatherData = ref(null);
    const getCity = ref<string>('');
    const getCountry = ref<string>('');
    const currentWeatherTemp = ref<number>(0);
    const currentWeatherUnit = ref<string>('');
    const currentISOCode = ref<string>('');
    const currentTimezone = ref<string>('');
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
                    hourly: 'temperature_2m,relative_humidity_2m',
                },
            });
            //  TODO: Convert the imperial units myself instead of doing a separate API call

            getCity.value = city;
            getCountry.value = country;
            currentWeatherTemp.value = response.data.current_weather.temperature;
            currentWeatherUnit.value = response.data.current_weather_units.temperature;
            currentISOCode.value = response.data.current_weather_units.time;
            currentTimezone.value = response.data.current_weather.time;

            console.log(currentWeatherUnit.value);
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

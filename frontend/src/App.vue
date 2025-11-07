<script setup lang="ts">
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'
import TheWelcome from './components/TheWelcome.vue'
import ForecastComponent from './components/ForecastComponent.vue'

interface ForecastItem {
  description: string
  temp: number
  time: string
}

interface Weather {
  city: string
  forecast: ForecastItem[]
  temperature: number
  weather: string
}

const baseUrl = import.meta.env.VITE_BASE_URL

const city = ref('')
const weather = ref<Weather | null>(null)
const loading = ref(false)
const error = ref('')

const fetchWeather = async () => {
  if (!city.value) return

  loading.value = true
  error.value = ''
  weather.value = null

  try {
    const response = await axios.get(`${baseUrl}/api/weather/${city.value}`)
    weather.value = response.data
  } catch (err: unknown) {
    const axiosError = err as AxiosError<{ message: string }>
    if (axiosError.response) {
      const status = axiosError.response.status;
      if (axiosError.response.data?.message) {
        error.value = axiosError.response.data.message;
      } else if (status === 404) {
        error.value = 'City not found!';
      } else if (status === 429) {
        error.value = 'API rate limit exceeded. Please try again later.';
      } else if (status >= 500) {
        error.value = 'Server error. Please try again later.';
      } else {
        error.value = `Error: ${status}`;
      }
    } else if (axiosError.request) {
      error.value = 'Network error. Please check your connection.';
    } else {
      error.value = 'An unexpected error occurred.';
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="app">
    <TheWelcome />

    <div class="search-section">
      <div class="search-container">
        <input
          v-model="city"
          @input="city = city.replace(/[^a-zA-Z\s\-]/g, '')"
          @keyup.enter="fetchWeather"
          placeholder="Search city..."
          class="search-input"
          aria-label="Search for a city"
        />
        <button @click="fetchWeather" :disabled="city.length === 0" class="search-button">
          Search
        </button>
      </div>
    </div>

    <div class="content">
      <p v-if="loading" class="status loading">⏳ Loading weather...</p>
      <p v-if="error" class="status error">❌ {{ error }}</p>

      <div v-if="weather" class="weather-info">
        <div class="weather-header">
          <h2 class="city-name">{{ weather.city }}</h2>
          <p class="weather-description">{{ weather.weather }}</p>
        </div>

        <div class="temperature-display">
          <span class="temp-value">{{ Math.round(weather.temperature) }}</span>
          <span class="temp-unit">°C</span>
        </div>
      </div>

      <ForecastComponent v-if="weather" :forecast="weather.forecast || []" />
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  padding-left: 14%;
  padding-right: 14%;
}

.search-section {
  width: 100%;
  padding: 30px 20px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.search-container {
  width: 100%;
  display: flex;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.search-input:focus {
  outline: none;
  border-color: #999;
  box-shadow: 0 0 0 3px rgba(153, 153, 153, 0.1);
}

.search-button {
  padding: 12px 24px;
  background: #333;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover:not(:disabled) {
  background: #1a1a1a;
}

.search-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.content {
  width: 100%;
  flex: 1;
  padding: 30px 20px;
}

.status {
  text-align: center;
  font-size: 14px;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.status.loading {
  background: #f0f7ff;
  color: #0066cc;
}

.status.error {
  background: #fff5f5;
  color: #cc0000;
  font-weight: 500;
}

.weather-info {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: center;
}

.weather-header {
  margin-right: 0;
  padding-right: 0;
  border-right: none;
  padding-bottom: 0;
}

.city-name {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
}

.weather-description {
  margin: 0;
  font-size: 14px;
  color: #666;
  text-transform: capitalize;
}

.temperature-display {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  justify-content: flex-end;
}

.temp-value {
  font-size: 56px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
}

.temp-unit {
  font-size: 24px;
  color: #666;
  margin-top: 8px;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'
import TheWelcome from './components/TheWelcome.vue'

interface Weather {
  city: string
  forecast: {
    description: string
    temp: string
    time: string
  }
  temperature: number
  weather: string
}

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
    const response = await axios.get(`http://localhost:5000/api/weather/${city.value}`)
    console.log(response)
    weather.value = response.data
  } catch (err: unknown) {
    const axiosError = err as AxiosError<{ message: string }>
    error.value = axiosError.response?.data?.message || 'City not found!'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container">
    <TheWelcome />

    <input v-model="city" @keyup.enter="fetchWeather" placeholder="Enter city (ex: Accra)" />
    <button @click="fetchWeather">Search</button>

    <p v-if="loading">⏳ Loading weather...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="weather" class="weather-card">
      <h2>{{ weather.city }}</h2>
      <p><strong>Temperature:</strong> {{ weather.temperature }}°C</p>
      <p class="description"><strong>Condition:</strong> {{ weather.weather }}</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  text-align: center;
  padding: 1rem;
}

h2 {
  color: black;
}

input {
  width: 70%;
  padding: 8px;
  margin-right: 8px;
}

button {
  padding: 8px 12px;
  cursor: pointer;
}

.weather-card {
  background: #e3f2fd;
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  color: black;
}

.error {
  color: red;
  font-weight: bold;
}

.description {
  color: black;
}
</style>

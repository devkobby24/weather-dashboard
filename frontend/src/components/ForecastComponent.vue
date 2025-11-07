<script setup lang="ts">
interface ForecastItem {
  time: string
  temp: number
  description: string
}

interface Props {
  forecast: ForecastItem[]
}

withDefaults(defineProps<Props>(), {
  forecast: () => [],
})

const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch (error) {
    console.error('Error formatting date:', error, 'Input:', dateString)
    return 'Invalid date'
  }
}

const formatTemp = (temp: number): string => {
  return `${Math.round(temp)}°C`
}
</script>

<template>
  <div class="forecast-container">
    <h2>3-hour Forecast</h2>

    <div v-if="forecast.length === 0" class="no-forecast">
      <p>No forecast data available</p>
    </div>

    <div v-else class="forecast-grid">
      <div v-for="(item, index) in forecast" :key="index" class="forecast-card">
        <div class="forecast-time">{{ formatTime(item.time) }}</div>
        <div class="forecast-temp">{{ formatTemp(item.temp) }}</div>
        <div class="forecast-description">{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forecast-container {
  margin-top: 40px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.forecast-container h2 {
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: 600;
}

.no-forecast {
  text-align: center;
  padding: 20px;
  opacity: 0.7;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.forecast-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.forecast-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.forecast-time {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 8px;
  font-weight: 500;
}

.forecast-temp {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.forecast-description {
  font-size: 13px;
  opacity: 0.9;
  text-transform: capitalize;
  line-height: 1.4;
}
</style>

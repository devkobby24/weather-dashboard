<script setup lang="ts">
import { ref } from 'vue'

const currentTime = ref(new Date().toLocaleTimeString())

setInterval(() => {
  currentTime.value = new Date().toLocaleTimeString()
}, 1000)
</script>

<template>
  <div class="welcome-section">
    <h1>Weather Dashboard</h1>
    <p class="subtitle">Get accurate weather forecasts for any city</p>
    <div class="time-display">{{ currentTime }}</div>
  </div>
</template>

<style lang="css" scoped>
.welcome-section {
  margin-bottom: 40px;
  padding: 30px 0;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

h1 {
  margin: 0 0 10px 0;
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
}

.subtitle {
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #666;
  font-weight: 400;
}

.time-display {
  font-size: 13px;
  color: #999;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}
</style>

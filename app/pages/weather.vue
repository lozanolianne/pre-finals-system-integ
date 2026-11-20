<template>
  <div class="weather-page">
    <v-container class="weather-container">
      <!-- Header -->
      <div class="weather-heading">
        <div>
          <div class="weather-label">
            <v-icon size="16">mdi-weather-partly-cloudy</v-icon>
            LOCAL WEATHER
          </div>
          <h1>San Fernando</h1>
          <p>Pampanga, Philippines</p>
        </div>

        <v-btn
          icon="mdi-refresh"
          color="primary"
          variant="tonal"
          :loading="loading"
          @click="loadWeather"
        />
      </div>

      <!-- Error -->
      <v-alert
        v-if="errorMessage"
        type="warning"
        variant="tonal"
        class="mb-4"
      >
        {{ errorMessage }}
      </v-alert>

      <!-- Current Weather -->
      <v-card class="current-card" rounded="xl" elevation="0">
        <v-card-text class="pa-6">
          <div class="current-top">
            <div>
              <div class="current-label">
                <v-icon size="16">mdi-thermometer</v-icon>
                Current temperature
              </div>

              <div class="temperature">
                {{ currentTemperature }}<span>°C</span>
              </div>

              <h2>{{ currentCondition }}</h2>
              <p class="feels-like">Feels like {{ feelsLike }}°C</p>
            </div>

            <div class="weather-icon">
              <v-icon :color="currentIconColor" size="75">
                {{ currentIcon }}
              </v-icon>
            </div>
          </div>

          <v-divider class="my-5" color="white" opacity="0.3" />

          <div class="weather-stats">
            <div class="stat-item">
              <v-icon>mdi-water-percent</v-icon>
              <div>
                <span>Humidity</span>
                <strong>{{ humidity }}%</strong>
              </div>
            </div>

            <div class="stat-item">
              <v-icon>mdi-weather-windy</v-icon>
              <div>
                <span>Wind</span>
                <strong>{{ windSpeed }} km/h</strong>
              </div>
            </div>

            <div class="stat-item">
              <v-icon>mdi-white-balance-sunny</v-icon>
              <div>
                <span>UV Index</span>
                <strong>{{ uvIndex }}</strong>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Hourly Forecast -->
      <v-card class="forecast-card" rounded="xl" elevation="0">
        <div class="section-heading">
          <div>
            <h2>Hourly Forecast</h2>
            <p>Weather throughout the day</p>
          </div>
          <v-icon color="primary">mdi-clock-outline</v-icon>
        </div>

        <div v-if="hourlyForecast.length" class="hourly-list">
          <div
            v-for="(hour, index) in hourlyForecast"
            :key="index"
            class="hour-item"
            :class="{ active: index === 0 }"
          >
            <span>{{ hour.time }}</span>
            <v-icon :color="hour.iconColor" size="28">
              {{ hour.icon }}
            </v-icon>
            <strong>{{ hour.temperature }}°</strong>
            <small>{{ hour.precipitation }}% rain</small>
          </div>
        </div>

        <div v-else class="empty-message">
          {{ loading ? 'Loading forecast...' : 'No hourly forecast available.' }}
        </div>
      </v-card>

      <!-- Daily Forecast -->
      <v-card class="forecast-card" rounded="xl" elevation="0">
        <div class="section-heading">
          <div>
            <h2>Weather Forecast</h2>
            <p>Weather for the upcoming days</p>
          </div>
          <v-icon color="primary">mdi-calendar-month-outline</v-icon>
        </div>

        <div v-if="dailyForecast.length">
          <div
            v-for="day in dailyForecast"
            :key="day.day"
            class="daily-item"
          >
            <div class="daily-weather">
              <div class="daily-icon">
                <v-icon :color="day.iconColor" size="27">
                  {{ day.icon }}
                </v-icon>
              </div>

              <div>
                <h3>{{ day.day }}</h3>
                <p>{{ day.condition }}</p>
              </div>
            </div>

            <div class="daily-temperature">
              <strong>{{ day.high }}°</strong>
              <span>{{ day.low }}°</span>
            </div>
          </div>
        </div>

        <div v-else class="empty-message">
          {{ loading ? 'Loading forecast...' : 'No daily forecast available.' }}
        </div>
      </v-card>

      <!-- Updated Time -->
      <div class="weather-footer">
        <v-icon size="15">mdi-update</v-icon>
        Updated {{ updatedText }}
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
const loading = ref(false)
const errorMessage = ref('')
const updatedText = ref('Not yet')

const currentTemperature = ref(0)
const feelsLike = ref(0)
const humidity = ref(0)
const windSpeed = ref(0)
const uvIndex = ref(0)

const currentCondition = ref('Loading forecast...')
const currentIcon = ref('mdi-weather-sunny')
const currentIconColor = ref('amber')

const hourlyForecast = ref<any[]>([])
const dailyForecast = ref<any[]>([])

function getWeatherIcon(condition: string, isDay = 1) {
  const text = condition.toLowerCase()

  if (text.includes('thunder')) {
    return { icon: 'mdi-weather-lightning-rainy', iconColor: 'deep-purple' }
  }

  if (['rain', 'drizzle', 'shower'].some(word => text.includes(word))) {
    return { icon: 'mdi-weather-rainy', iconColor: 'blue' }
  }

  if (text.includes('snow')) {
    return { icon: 'mdi-weather-snowy', iconColor: 'light-blue' }
  }

  if (text.includes('fog') || text.includes('mist')) {
    return { icon: 'mdi-weather-fog', iconColor: 'blue-grey' }
  }

  if (text.includes('cloud') || text.includes('overcast')) {
    return {
      icon: text.includes('partly')
        ? 'mdi-weather-partly-cloudy'
        : 'mdi-weather-cloudy',
      iconColor: 'blue-grey'
    }
  }

  return {
    icon: isDay ? 'mdi-weather-sunny' : 'mdi-weather-night',
    iconColor: 'amber'
  }
}

async function loadWeather() {
  loading.value = true
  errorMessage.value = ''

  try {
    const data: any = await $fetch('/api/weather')

    // Current weather
    const current = data.current

    currentTemperature.value = Math.round(current.temp_c)
    feelsLike.value = Math.round(current.feelslike_c)
    humidity.value = current.humidity
    windSpeed.value = Math.round(current.wind_kph)
    uvIndex.value = current.uv
    currentCondition.value = current.condition.text

    const currentIconData = getWeatherIcon(
      current.condition.text,
      current.is_day
    )

    currentIcon.value = currentIconData.icon
    currentIconColor.value = currentIconData.iconColor

    // Hourly forecast
    const hours = data.forecast.forecastday.flatMap(
      (day: any) => day.hour
    )

    hourlyForecast.value = hours
      .filter((hour: any) => hour.time_epoch >= Date.now() / 1000)
      .slice(0, 8)
      .map((hour: any) => ({
        ...getWeatherIcon(hour.condition.text, hour.is_day),
        time: new Date(
          hour.time.replace(' ', 'T') + '+08:00'
        ).toLocaleTimeString('en-PH', {
          hour: 'numeric',
          hour12: true
        }),
        temperature: Math.round(hour.temp_c),
        precipitation: hour.chance_of_rain
      }))

    // Daily forecast
    dailyForecast.value = data.forecast.forecastday.map(
      (day: any, index: number) => ({
        ...getWeatherIcon(day.day.condition.text),
        day: index === 0
          ? 'Today'
          : new Date(day.date + 'T12:00:00+08:00')
              .toLocaleDateString('en-PH', { weekday: 'long' }),
        condition: day.day.condition.text,
        high: Math.round(day.day.maxtemp_c),
        low: Math.round(day.day.mintemp_c)
      })
    )

    updatedText.value = new Date().toLocaleTimeString('en-PH', {
      hour: 'numeric',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Weather error:', error)
    errorMessage.value =
      'Unable to load weather. Please check your API key and internet connection.'
  } finally {
    loading.value = false
  }
}

onMounted(loadWeather)
</script>

<style scoped>
.weather-page {
  min-height: 100%;
  padding: 15px 20px 35px;
  background: #f6f5fb;
}

.weather-container {
  max-width: 900px;
  margin: auto;
  padding: 24px 16px;
}

/* Header */
.weather-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.weather-label {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 8px;
  color: #438c85;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
}

.weather-heading h1 {
  color: #315e5a;
  font-size: 29px;
  font-weight: 750;
}

.weather-heading p {
  margin-top: 5px;
  color: #718b88;
  font-size: 13px;
}

/* Current Weather */
.current-card {
  margin-bottom: 18px;
  color: white;
  background: linear-gradient(120deg, #367a75, #5b9e96, #8bbdb5);
  box-shadow: 0 8px 22px rgba(54, 122, 117, 0.15);
}

.current-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.current-label {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #e0f2ef;
  font-size: 12px;
}

.temperature {
  margin: 8px 0;
  font-size: 70px;
  font-weight: 300;
  line-height: 1.2;
}

.temperature span {
  font-size: 25px;
  vertical-align: top;
}

.current-top h2 {
  font-size: 15px;
}

.feels-like {
  margin-top: 4px;
  color: #d6ebe7;
  font-size: 12px;
}

.weather-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 105px;
  height: 105px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.13);
}

/* Weather Details */
.weather-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-item > .v-icon {
  color: #c5e8e2;
}

.stat-item span {
  display: block;
  margin-bottom: 3px;
  color: #d6ebe7;
  font-size: 11px;
}

.stat-item strong {
  color: white;
  font-size: 13px;
}

/* Forecast Cards */
.forecast-card {
  padding: 20px;
  margin-bottom: 17px;
  background: white;
  border: 1px solid #d8eae7;
  box-shadow: 0 4px 14px rgba(54, 122, 117, 0.05);
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 17px;
}

.section-heading h2 {
  color: #315e5a;
  font-size: 16px;
  font-weight: 700;
}

.section-heading p {
  margin-top: 3px;
  color: #718b88;
  font-size: 11px;
}

/* Hourly Forecast */
.hourly-list {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  overflow-x: auto;
}

.hour-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 65px;
  padding: 12px 5px;
  border-radius: 13px;
}

.hour-item.active {
  background: #e5f4f2;
}

.hour-item span {
  color: #718b88;
  font-size: 11px;
}

.hour-item strong {
  color: #315e5a;
  font-size: 14px;
}

.hour-item small {
  color: #718b88;
  font-size: 10px;
  white-space: nowrap;
}

/* Daily Forecast */
.daily-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 7px;
  border-bottom: 1px solid #edf3f2;
}

.daily-item:last-child {
  border-bottom: none;
}

.daily-weather {
  display: flex;
  align-items: center;
  gap: 13px;
}

.daily-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 39px;
  height: 39px;
  border-radius: 12px;
  background: #e5f4f2;
}

.daily-weather h3 {
  color: #315e5a;
  font-size: 13px;
  font-weight: 600;
}

.daily-weather p {
  margin-top: 3px;
  color: #718b88;
  font-size: 11px;
}

.daily-temperature {
  display: flex;
  gap: 15px;
  font-size: 13px;
}

.daily-temperature strong {
  color: #315e5a;
}

.daily-temperature span {
  color: #91aaa6;
}

/* Empty State and Footer */
.empty-message {
  padding: 25px 10px;
  color: #718b88;
  font-size: 12px;
  text-align: center;
}

.weather-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 8px 0;
  color: #718b88;
  font-size: 10px;
}

/* Mobile */
@media (max-width: 600px) {
  .weather-page {
    padding: 5px 8px 25px;
  }

  .weather-container {
    padding: 18px 8px;
  }

  .weather-heading h1 {
    font-size: 25px;
  }

  .temperature {
    font-size: 58px;
  }

  .weather-icon {
    width: 75px;
    height: 75px;
  }

  .weather-stats {
    gap: 7px;
  }

  .stat-item {
    gap: 5px;
  }

  .stat-item span {
    font-size: 10px;
  }

  .stat-item strong {
    font-size: 11px;
  }

  .forecast-card {
    padding: 16px 13px;
  }

  .daily-temperature {
    gap: 9px;
  }
}
</style>

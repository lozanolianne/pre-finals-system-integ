
export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  if (!config.weatherApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Weather API key is missing.'
    })
  }

  try {
    return await $fetch('https://api.weatherapi.com/v1/forecast.json', {
      query: {
        key: config.weatherApiKey,
        q: 'San Fernando, Pampanga, Philippines',
        days: 5,
        aqi: 'no',
        alerts: 'no'
      }
    })
  } catch (error: any) {
    console.error('Weather API error:', error?.data || error)

    throw createError({
      statusCode: error?.response?.status || 502,
      statusMessage: 'Unable to retrieve weather information.'
    })
  }
})

// src/composables/useCurrentDate.js
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'

export function useCurrentDate() {
  const dateNow = ref(dayjs().format('dddd, DD MMMM YYYY HH:mm:ss'))

  // Update dateNow every second
  const updateDateNow = () => {
    dateNow.value = dayjs().format('dddd, DD MMMM YYYY HH:mm:ss')
  }

  onMounted(() => {
    const interval = setInterval(updateDateNow, 1000)
    onUnmounted(() => {
      clearInterval(interval)
    })
  })

  return {
    dateNow,
  }
}

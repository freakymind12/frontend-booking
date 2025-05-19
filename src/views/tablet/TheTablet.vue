<template>
  <a-flex justify="center" gap="small" align="center" class="tablet-view">
    <RoomInfo />
    <RoomSchedule />
  </a-flex>
</template>

<script setup>
import RoomInfo from '@/views/tablet/component/RoomInfo.vue'
import RoomSchedule from '@/views/tablet/component/RoomSchedule.vue'
import { onMounted } from 'vue'
import { useBookingStore } from '@/stores/bookings'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'

const bookingStore = useBookingStore()

onMounted(async () => {
  await bookingStore.get({
    id_room: useRoute().params.id_room,
    date: dayjs().format('YYYY-MM-DD'),
    status: 'All',
  })
})
</script>

<style scoped>
.tablet-view {
  height: 100dvh;
  background: #f0f2f5;
}
</style>

<template>
  <div>
    <a-divider orientation="left">
      <span class="x-large divider-title">Room Status</span>
    </a-divider>

    <a-row :gutter="[8, 8]" :wrap="true" class="room-status">
      <a-col :sm="24" :lg="12" :xl="12" v-for="room in roomStore.rooms" :key="room.id_room">
        <RoomCard :data="room" />
      </a-col>
    </a-row>

    <a-divider orientation="left">
      <span class="x-large divider-title">Report</span>
    </a-divider>

    <a-row :gutter="[8, 8]" :wrap="true" class="room-status">
      <a-col :xs="24" :sm="24" :lg="8" :xl="8">
        <a-row :gutter="[8, 8]" :wrap="true">
          <FilterReport />
          <a-col :xs="24" :sm="24" :lg="24" :xl="24">
            <PieChart
              title="Graphic Bookings"
              height="510px"
              sub-title="Bookings"
              :data="reportStore.formattedBookingByStatus"
            />
          </a-col>
        </a-row>
      </a-col>
      <!-- Kiri (konten besar) -->
      <a-col :xs="24" :sm="24" :lg="8" :xl="8">
        <ReportUserAndDept />
      </a-col>
      <a-col :xs="24" :sm="24" :lg="8" :xl="8">
        <ReportRooms />
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { useRoomStore } from '@/stores/room'
import { onMounted, onUnmounted } from 'vue'
import { useBookingStore } from '../../stores/bookings'
import { useReportStore } from '@/stores/report'
import FilterReport from './components/FilterReport.vue'
import ReportUserAndDept from './components/ReportUserAndDept.vue'
import ReportRooms from './components/ReportRooms.vue'
import RoomCard from './components/RoomCard.vue'
import PieChart from '@/components/PieChart.vue'
import dayjs from 'dayjs'

const roomStore = useRoomStore()
const bookingStore = useBookingStore()
const reportStore = useReportStore()

let interval = 0

const fetchBookings = async () => {
  await bookingStore.get({
    date: dayjs().format('YYYY-MM-DD'),
  })
}

onMounted(async () => {
  await roomStore.get()
  fetchBookings()

  interval = setInterval(async () => {
    fetchBookings()
  }, 10000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.divider-title {
  background-color: #f5f5f5;
  padding-left: 5px;
  padding-right: 5px;
}

.room-status {
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>

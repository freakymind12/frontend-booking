<template>
  <!-- <a-col :span="6"> -->
  <a-card class="booking-card">
    <a-flex justify="space-between">
      <h2>Schedule {{ props.room.room_name }}</h2>
      <a-date-picker style="height: 32px; width: 30%" v-model:value="selectedDate" />
    </a-flex>
    <a-timeline>
      <a-timeline-item v-for="item in bookingList" :key="item.id_booking">
        <a-space direction="vertical">
          <div>
            <a-tag color="red">
              <template #icon><user-outlined /></template>
              {{ item.username }}
            </a-tag>
            <a-tag color="pink">
              <template #icon> <bank-outlined /></template>{{ item.dept }}</a-tag
            >
            <a-tag color="cyan">
              <template #icon> <clock-circle-outlined /> </template
              >{{ calculateDuration(item.start, item.end) }} min</a-tag
            >
          </div>
          <div>
            <a-tag color="green"
              ><form-outlined /> {{ capitalizeEachWord(item.meeting_name) }}</a-tag
            >
            <a-tag color="purple"
              ><EnvironmentOutlined /> {{ capitalizeEachWord(item.room_name) }}</a-tag
            >
          </div>
          <div>
            <a-tag color="#108ee9">Start : {{ item.start }}</a-tag>
            <a-tag color="#108ee9">End : {{ item.end }}</a-tag>
          </div>
        </a-space>
      </a-timeline-item>
      <a-empty
        :image="simpleImage"
        v-if="bookingList.length == 0"
        description="There is no schedule"
      />
    </a-timeline>
  </a-card>
  <!-- </a-col> -->
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import {
  ClockCircleOutlined,
  BankOutlined,
  FormOutlined,
  EnvironmentOutlined,
  UserOutlined
} from '@ant-design/icons-vue'

const bookingList = ref([])
const props = defineProps({
  room: Object,
  refreshKey: Number
})
const selectedDate = ref(dayjs())

const fetchBookingList = async () => {
  if (!props.room || !props.room.id_room) return

  try {
    const formattedDate = dayjs(selectedDate.value).format('YYYY-MM-DD')
    const response = await axios.get(
      `http://192.168.148.125:5151/bookings/queue?id_room=${props.room.id_room}&date=${formattedDate}`
    )
    bookingList.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}

const calculateDuration = (startDateTime, endDateTime) => {
  const start = new Date(startDateTime)
  const end = new Date(endDateTime)
  const differenceInMinutes = Math.round((end - start) / (1000 * 60)).toLocaleString()
  return differenceInMinutes
}

const capitalizeEachWord = (str) =>
  str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

// Watch for changes in room, refreshKey, or selectedDate
watch([() => props.room, () => props.refreshKey, () => selectedDate.value], fetchBookingList)

onMounted(fetchBookingList)
</script>

<style scoped>
.booking-card {
  height: 600px;
  overflow-y: auto;
  padding-right: 8px;
  text-align: left;
  width: 450px;
  border: solid #264d8e 1px;
}

.booking-card h2 {
  margin-bottom: 30px;
}

.booking-card::-webkit-scrollbar {
  display: none; /* Menyembunyikan scrollbar */
}
</style>

<template>
  <!-- <a-col :span="6"> -->
  <a-card class="booking-card">
    <a-flex justify="space-between">
      <h2>{{ props.room.room_name }}</h2>
      <a-date-picker style="height: 32px; width: 35%" v-model:value="selectedDate" />
    </a-flex>
    <a-timeline>
      <a-timeline-item v-for="item in bookingList" :key="item.id_booking">
        <a-space direction="vertical" style="margin-bottom: 8px;">
          <div>
            <a-tag color="red">
              <template #icon><user-outlined /></template>
              {{ item.username }}
            </a-tag>
            <a-tag color="pink">
              <template #icon> <bank-outlined /></template>{{ item.dept }}</a-tag>
            <a-tag color="cyan">
              <template #icon> <clock-circle-outlined /> </template>{{ calculateDuration(item.start, item.end) }}
              min</a-tag>
          </div>
          <div>
            <a-tag color="green"><form-outlined /> {{ item.meeting_name }}</a-tag>
          </div>
          <div>
            <a-tag color="purple">
              <EnvironmentOutlined /> {{ item.room_name }}
            </a-tag>
            <a-tag color="#108ee9">Time : {{ item.start.split(' ')[1].slice(0, 5) }} -
              {{ item.end.split(' ')[1].slice(0, 5) }}</a-tag>
          </div>
        </a-space>
        <a-popconfirm title="Are you sure delete this meeting schedule ?" @confirm="handleDelete(item.id_booking)">
          <a-tag class="delete-button" color="#FF0B55" v-if="user.role == 'admin'">
            <DeleteOutlined /> Delete
          </a-tag>
        </a-popconfirm>
      </a-timeline-item>
    </a-timeline>
    <div class="empty-list" v-if="bookingList.length == 0">
      <a-empty description="There is no schedule" />
    </div>
  </a-card>
  <!-- </a-col> -->
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import auth from '@/auth/auth'
import dayjs from 'dayjs'
import {
  ClockCircleOutlined,
  BankOutlined,
  FormOutlined,
  EnvironmentOutlined,
  UserOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const bookingList = ref([])
const user = ref()
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
      `http://192.168.148.201:5050/bookings/queue?id_room=${props.room.id_room}&date=${formattedDate}`
    )
    bookingList.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}

const getUserData = async () => {
  try {
    user.value = await auth.checkRoles()
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = async (id) => {
  try {
    await axios.delete(`http://192.168.148.201:5050/bookings/${id}`)
    message.success('Delete booking successfully')
    fetchBookingList()
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

// const capitalizeEachWord = (str) =>
//   str
//     .split(' ')
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//     .join(' ')

// Watch for changes in room, refreshKey, or selectedDate
watch([() => props.room, () => props.refreshKey, () => selectedDate.value], fetchBookingList)

onMounted(async () => {
  await fetchBookingList()
  await getUserData()

  console.log(user.value)
})
</script>

<style scoped>
.booking-card {
  height: 600px;
  overflow-y: auto;
  padding-right: 8px;
  text-align: left;
  width: 400px;
  border: solid #264d8e 1px;
}

.booking-card h2 {
  margin-bottom: 30px;
}

.booking-card::-webkit-scrollbar {
  display: none;
  /* Menyembunyikan scrollbar */
}

.empty-list {
  padding-top: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ant-tag {
  font-size: 14px;
  white-space: normal;
  word-wrap: break-word;
}

.delete-button:hover {
  transform: scale(1.02);
  cursor: pointer;
}
</style>

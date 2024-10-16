<template>
  <!-- <a-col :span="6"> -->
  <a-card class="booking-card">
    <a-flex justify="space-between">
      <h2>Your Booking List</h2>
      <a-date-picker style="height: 32px; width: 35%" v-model:value="selectedDate" />
    </a-flex>
    <a-timeline>
      <a-timeline-item v-for="item in bookingList" :key="item.id_booking">
        <a-space direction="vertical">
          <div>
            <a-tag color="green"
              ><form-outlined /> {{ capitalizeEachWord(item.meeting_name) }}</a-tag
            >
          </div>
          <div>
            <a-tag color="purple"
              ><environment-outlined /> {{ capitalizeEachWord(item.room_name) }}</a-tag
            >
            <a-tag color="cyan">
              <template #icon> <clock-circle-outlined /> </template
              >{{ calculateDuration(item.start, item.end) }} min</a-tag
            >
          </div>
          <div>
            <a-tag color="#108ee9"
              >Time : {{ item.start.split(' ')[1].slice(0, 5) }} -
              {{ item.end.split(' ')[1].slice(0, 5) }}</a-tag
            >

            <a-popconfirm
              title="Are you sure delete this booking?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="handleDelete(item.id_booking)"
            >
              <a-tag color="red" class="delete-tag"><delete-outlined /></a-tag>
            </a-popconfirm>
          </div>
        </a-space>
      </a-timeline-item>
    </a-timeline>
    <div class="empty-list">
      <a-empty
        :image="simpleImage"
        v-if="bookingList.length == 0"
        description="Booking list empty"
      />
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
  DeleteOutlined,
  FormOutlined,
  EnvironmentOutlined
} from '@ant-design/icons-vue'

const user = ref('')
const bookingList = ref('')
const props = defineProps({
  refreshKey: Number
})
const selectedDate = ref(dayjs())
const emits = defineEmits(['delete-booking'])

const fetchBookingList = async () => {
  try {
    const formattedDate = dayjs(selectedDate.value).format('YYYY-MM-DD')
    const response = await axios.get(
      `http://192.168.148.201:5050/bookings/user?id_user=${user.value.id}&date=${formattedDate}`
    )
    bookingList.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}

const calculateDuration = (startDateTime, endDateTime) => {
  const start = new Date(startDateTime)
  const end = new Date(endDateTime)
  const differenceInMillis = end - start
  const differenceInMinutes = Math.round(differenceInMillis / (1000 * 60)).toLocaleString()
  return differenceInMinutes
}

const capitalizeEachWord = (str) => {
  return str
    .split(' ') // Pisahkan string menjadi array kata
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Kapitalisasi setiap kata
    .join(' ') // Gabungkan kembali array menjadi string
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
    emits('delete-booking')
    fetchBookingList()
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => props.refreshKey,
  () => {
    fetchBookingList()
  }
)

watch(
  () => selectedDate.value,
  () => {
    fetchBookingList()
  }
)

onMounted(async () => {
  await getUserData()
  await fetchBookingList()
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
  display: none; /* Menyembunyikan scrollbar */
}

.delete-tag:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transform: scale(1.02);
  cursor: pointer;
}

.empty-list {
  padding-top: 45%;
}
</style>

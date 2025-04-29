<template>
  <!-- <a-col :span="6"> -->
  <a-card class="booking-card">
    <a-flex justify="space-between" align="center">
      <h2>Your Booking List</h2>
      <a-input v-model:value="search" placeholder="Search.." class="search" size="small">
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input>
    </a-flex>
    <a-timeline>
      <a-timeline-item v-for="item in filteredBookingList" :key="item.id_booking">
        <a-space direction="vertical">
          <div>
            <a-tag color="grey">Date : {{ item.start.split(' ')[0] }}</a-tag>
            <a-tag color="#108ee9"
              >Time : {{ item.start.split(' ')[1].slice(0, 5) }} -
              {{ item.end.split(' ')[1].slice(0, 5) }}</a-tag
            >
          </div>
          <div>
            <a-tag color="green"><form-outlined /> {{ item.meeting_name }}</a-tag>
          </div>
          <div>
            <a-tag color="purple"><environment-outlined /> {{ item.room_name }}</a-tag>
            <a-tag color="cyan">
              <template #icon> <clock-circle-outlined /> </template
              >{{ calculateDuration(item.start, item.end) }} min</a-tag
            >
          </div>

          <div>
            <a-popconfirm
              title="Are you sure delete this booking?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="handleDelete(item.id_booking)"
            >
              <a-tag color="red" class="delete-tag"><delete-outlined /> Delete</a-tag>
            </a-popconfirm>
          </div>
        </a-space>
      </a-timeline-item>
    </a-timeline>
    <div class="empty-list">
      <a-empty
        v-if="bookingList.length == 0"
        description="Booking list empty"
      />
    </div>
  </a-card>
  <!-- </a-col> -->
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, ref, watch } from 'vue'
import auth from '@/auth/auth'
import {
  ClockCircleOutlined,
  DeleteOutlined,
  FormOutlined,
  EnvironmentOutlined,
  SearchOutlined
} from '@ant-design/icons-vue'

const user = ref('')
const bookingList = ref('')
const search = ref('')
const props = defineProps({
  refreshKey: Number
})
const emits = defineEmits(['delete-booking'])

const fetchBookingList = async () => {
  try {
    const response = await axios.get(
      `http://192.168.148.201:5050/bookings/user?id_user=${user.value.id}`
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

const filteredBookingList = computed(() => {
  if (!search.value) {
    return bookingList.value
  }
  return bookingList.value.filter(
    (booking) =>
      booking.meeting_name.toLowerCase().includes(search.value.toLowerCase()) ||
      booking.room_name.toLowerCase().includes(search.value.toLowerCase()) ||
      booking.start.toLowerCase().includes(search.value.toLowerCase()) ||
      booking.end.toLowerCase().includes(search.value.toLowerCase())
  )
})

watch(
  () => props.refreshKey,
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
  display: none;
}

.delete-tag:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transform: scale(1.02);
  cursor: pointer;
}

.empty-list {
  padding-top: 45%;
}

.search{
  width: 40%;
  margin-bottom: 30px;
  height: fit-content;
}

.ant-tag {
  font-size: 14px;
  white-space: normal;
  word-wrap: break-word;
}
</style>

<template>
  <a-card class="booking-card">
    <h2>Fill this form to booking</h2>
    <a-form layout="vertical" :model="form" @finish="handleBooking">
      <a-form-item label="Room" name="id_room" :rules="[{ required: true }]">
        <a-select v-model:value="form.id_room" placeholder="Room">
          <a-select-option v-for="room in rooms" :key="room.id_room" :value="room.id_room">{{
            room.room_name
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Meeting Name" name="meeting_name" :rules="[{ required: true }]">
        <a-input placeholder="Meeting Name" v-model:value="form.meeting_name" />
      </a-form-item>
      <a-form-item label="Start & End Time" name="time" :rules="[{ required: true }]">
        <a-range-picker
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          :placeholder="['Start Time', 'End Time']"
          v-model:value="form.time"
          :disabled-date="disabledDate"
          :disabled-time="disabledTime"
        />
      </a-form-item>
      <a-form-item>
        <a-flex justify="flex-end">
          <a-space :size="10">
            <a-button
              @click="handleReset"
              :disabled="form.id_room === '' || form.meeting_name === '' || form.time.length === 0"
              >Reset</a-button
            >
            <a-button
              type="primary"
              html-type="submit"
              :disabled="
                form.id_room === '' ||
                form.meeting_name === '' ||
                form.time.length === 0 ||
                validationResponse.data.booking.length > 0
              "
            >
              Submit
            </a-button>
          </a-space>
        </a-flex>
      </a-form-item>
    </a-form>
    <p
      style="font-style: italic; font-weight: 500; color: red"
      v-if="validationResponse.data.booking.length > 0"
    >
      {{ validationResponse.message }}
    </p>
    <p
      style="font-style: italic; font-weight: 500; color: green"
      v-if="validationResponse.data.booking.length == 0 && validationResponse.message"
    >
      {{ validationResponse.message }}
    </p>
    <a-timeline class="clash-list" v-if="validationResponse.data.booking.length > 0">
      <a-timeline-item
        color="red"
        v-for="book in validationResponse.data.booking"
        :key="book.id_booking"
      >
        <a-flex gap="small" wrap="wrap">
          <a-tag color="green">
            <template #icon><form-outlined /></template>
            {{ book.meeting_name }}
          </a-tag>
          <a-tag color="red">
            <template #icon><user-outlined /></template>
            {{ book.username }}
          </a-tag>
          <a-tag color="#108ee9">
            Time :
            {{ book.start.split(' ')[1].slice(0, 8) }} -
            {{ book.end.split(' ')[1].slice(0, 8) }}</a-tag
          >
        </a-flex>
      </a-timeline-item>
    </a-timeline>
  </a-card>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import auth from '@/auth/auth'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { UserOutlined, FormOutlined } from '@ant-design/icons-vue'

dayjs.extend(utc)
dayjs.extend(timezone)

const form = ref({
  meeting_name: '',
  id_room: '',
  time: []
})
const rooms = ref()
const user = ref()
const emits = defineEmits(['add-bookings'])
const validationResponse = ref({
  data: {
    booking: []
  },
  message: ''
})

const getUserData = async () => {
  try {
    user.value = await auth.checkRoles()
  } catch (error) {
    console.error(error)
  }
}

const getRoomData = async () => {
  try {
    const response = await axios.get('http://192.168.148.201:5151/rooms')
    rooms.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}

const convertUtcTimesToLocal = (utcTimes) => {
  return utcTimes.map((time) => dayjs(time).utc().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'))
}

const handleBooking = async () => {
  try {
    const [startTime, endTime] = convertUtcTimesToLocal(form.value.time)
    await axios.post('http://192.168.148.201:5151/bookings', {
      id_room: form.value.id_room,
      meeting_name: form.value.meeting_name,
      id_user: user.value.id,
      start: startTime,
      end: endTime
    })
    emits('add-bookings')
    handleReset()
  } catch (error) {
    console.error(error)
  }
}

const handleReset = () => {
  form.value = {
    meeting_name: '',
    id_room: '',
    time: []
  }
  validationResponse.value = {
    data: {
      booking: []
    },
    message: ''
  }
}

const checkBooking = async (room, time) => {
  try {
    const [startTime, endTime] = convertUtcTimesToLocal(time)
    const response = await axios.get(
      `http://192.168.148.201:5151/bookings/check?id_room=${room}&start=${startTime}&end=${endTime}`
    )
    validationResponse.value = response.data
    console.log(validationResponse.value)
  } catch (error) {
    console.error(error)
  }
}

const disabledDate = (current) => {
  const today = new Date()
  const threeMonthsFromNow = new Date()
  threeMonthsFromNow.setMonth(today.getMonth() + 2)
  today.setHours(0, 0, 0, 0)
  threeMonthsFromNow.setHours(23, 59, 59, 999)
  return current < today || current > threeMonthsFromNow
}

const disabledTime = () => {
  return {
    disabledHours: () => {
      return [...Array(24).keys()].filter((h) => h < 7 || h > 19)
    }
  }
}

watch(
  () => form.value.id_room,
  (newRoom) => {
    if (newRoom && form.value.time.length === 2) {
      checkBooking(newRoom, form.value.time)
    }
  }
)

watch(
  () => form.value.time,
  (newTime) => {
    if (form.value.id_room && newTime.length === 2) {
      checkBooking(form.value.id_room, newTime)
    }
  }
)

onMounted(() => {
  getUserData()
  getRoomData()
})
</script>

<style scoped>
.booking-card {
  height: 600px;
  overflow-y: auto;
  padding-right: 8px;
  border: solid #264d8e 1px;
  max-width: 400px;
}

.booking-card::-webkit-scrollbar {
  display: none;
}

.clash-list {
  height: 150px;
  overflow: auto;
  padding: 2%;
}

.clash-list::-webkit-scrollbar {
  width: 8px;
}

.clash-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.clash-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.clash-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

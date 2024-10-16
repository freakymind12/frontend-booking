<template>
  <a-card class="queue">
    <a-flex justify="space-between" style="margin-bottom: 0.2rem">
      <h2><CarryOutOutlined style="color: #1990ff" /> Queue Room</h2>
      <a-space>
        <a-select
          v-model:value="selectedRoom"
          placeholder="Select a room"
          style="width: 200px"
          :options="options"
        ></a-select>
        <a-date-picker style="width: 120px" v-model:value="selectedDate" />
      </a-space>
    </a-flex>
    <a-flex vertical class="list-queue" :align="queueList.length == 0 ? 'center' : 'flex-start'">
      <a-card
        v-for="queue in queueList"
        :key="queue.id_booking"
        style="margin-bottom: 0.5rem; width: 100%"
      >
        <a-space gap="large">
          <a-tag color="red"><UserOutlined /> {{ queue.username }} </a-tag>
          <a-tag color="green"><FormOutlined /> {{ queue.meeting_name }}</a-tag>
          <a-tag color="pink"><BankOutlined /> {{ queue.dept }}</a-tag>
          <a-tag color="#108ee9"
            ><ClockCircleOutlined /> {{ queue.start.split(' ')[1].slice(0, 5) }} -
            {{ queue.end.split(' ')[1].slice(0, 5) }}</a-tag
          >
          <a-tag color="cyan">{{ calculateDuration(queue.start, queue.end) }} min</a-tag>
        </a-space>
      </a-card>
      <div class="empty-list" v-if="queueList.length == 0">
        <a-empty description="No Queue Data" />
      </div>
    </a-flex>
  </a-card>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import axios from 'axios'
import {
  UserOutlined,
  BankOutlined,
  ClockCircleOutlined,
  FormOutlined,
  CarryOutOutlined
} from '@ant-design/icons-vue'

const selectedRoom = ref(null)
const selectedDate = ref(dayjs())
const options = ref([])
const queueList = ref([])

const fetchRoom = async () => {
  try {
    const response = await axios.get('http://192.168.148.201:5050/rooms')
    options.value = response.data.data.map((room) => ({
      value: room.id_room,
      label: room.room_name
    }))
    selectedRoom.value = options.value[0].value
  } catch (error) {
    console.error(error)
  }
}

const fetchBooking = async (id_room, date) => {
  try {
    const formattedDate = dayjs(date).format('YYYY-MM-DD')
    const response = await axios.get(
      `http://192.168.148.201:5050/bookings/queue?id_room=${id_room}&date=${formattedDate}`
    )
    queueList.value = response.data.data
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

watch(
  () => selectedDate.value,
  (newDate) => {
    if (newDate) {
      fetchBooking(selectedRoom.value, selectedDate.value)
    }
  }
)

watch(
  () => selectedRoom.value,
  (newRoom) => {
    if (newRoom) {
      fetchBooking(newRoom, selectedDate.value)
    }
  }
)

onMounted(async () => {
  await fetchRoom()
  await fetchBooking(selectedRoom.value, selectedDate.value)
})
</script>

<style scoped>
.queue {
  height: 600px;
  width: 50%;
  border: solid #264d8e 1px;
}

.list-queue {
  height: 500px;
  overflow: auto;
  scrollbar-width: auto;
  padding-right: 8px;
  padding-left: 8px;
}

.list-queue::-webkit-scrollbar {
  width: 8px;
}

.list-queue::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.list-queue::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.list-queue::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.queue .ant-card {
  margin-bottom: 1rem;
}

.ant-tag {
  font-size: 0.8rem;
}
.empty-list {
  height: inherit;
  display: flex;
  width: inherit;
  justify-content: center;
  align-items: center;
}
</style>

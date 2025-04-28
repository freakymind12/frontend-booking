<template>
  <div class="container">
    <a-card size="small" class="schedule">
      <a-flex justify="space-between" align="center" class="mb">
        <span class="bold x-large">
          <CalendarTwoTone /> {{ roomStore.detailRoom?.room_name }}
        </span>
        <a-space size="small" align="center">
          <a-date-picker v-model:value="selectedDate" style="width: 120px;" @change="handleChangeDate" :disabledDate="disabledDate" />
        </a-space>
      </a-flex>
      <a-flex vertical gap="small" class="mb list-schedule">
        <a-card size="small" v-for="(book, index) in bookingStore.bookings" :key="index" :hoverable="true"
          class="card-booking">
          <span class="large bold"> {{ book.meeting_name }}</span>
          <a-flex align="center">
            <a-tag color="red" class="bold" style="font-size: 14px;">
              <UserOutlined /> {{ book.username }}
            </a-tag>
            <a-tag color="#8967B3" style="font-size: 14px;">
              <ClockCircleOutlined /> {{ book.start.split(' ')[1].slice(0, 5) }} - {{ book.end.split(' ')[1].slice(0, 5)
              }}
            </a-tag>
          </a-flex>
        </a-card>
        <a-empty class="empty" v-if="bookingStore.bookings.length === 0" description="There is no booking schedule" />
      </a-flex>
      <a-flex justify="center" align="center">
        <a-button type="primary" @click="backToQueue()" style="background-color: #264d8e;">
          <template #icon>
            <LeftCircleOutlined style="font-size: medium;" />
          </template>
          <span>
            Back to Queue
          </span>
        </a-button>
      </a-flex>

    </a-card>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useBookingsStore } from '@/stores/bookings'
import { useRoomStore } from '@/stores/rooms';
import { onMounted, ref } from 'vue'
import { LeftCircleOutlined, CalendarTwoTone, UserOutlined, ClockCircleOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs'


const selectedDate = ref(dayjs())
const roomStore = useRoomStore()
const bookingStore = useBookingsStore()
const route = useRoute()
const router = useRouter()
let id_room = route.params.idroom


onMounted(async () => {
  await bookingStore.getBookings({ id_room, date: selectedDate.value.format('YYYY-MM-DD') })
  await roomStore.getDetailRoom(id_room)
})

const backToQueue = () => {
  router.push(`/queue/${id_room}`)
}

const handleChangeDate = (date) => {
  bookingStore.getBookings({ id_room, date: date.format('YYYY-MM-DD') })
}

const disabledDate = (current) => {
  return current && current < dayjs().startOf('day');
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.schedule {
  width: 900px;
  border: 1px solid #264d8e;
}

.bold {
  font-weight: bold;
}

.large {
  font-size: large;
}

.x-large {
  font-size: x-large;
}

.mb {
  margin-bottom: 16px;
}

.list-schedule {
  height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}

.empty {
  padding-top: 15%;
}

.card-booking {
  border: 1px solid #797a7c65;
  border-radius: 10px;
}
</style>
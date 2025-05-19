<template>
  <a-flex justify="center" align="center" class="schedule-info">
    <a-card size="small" class="card-wrapper">
      <a-flex justify="space-between" class="mb" align="center">
        <span class="x-large bold"><calendar-outlined /> {{ roomData?.room_name }}</span>
        <a-date-picker
          v-model:value="selectedDate"
          class="date-picker"
          :allowClear="false"
          :disabledDate="disabledDate"
        />
      </a-flex>
      <a-flex vertical :gap="10" class="list-schedule">
        <a-card
          size="small"
          v-for="(booking, index) in bookingStore.bookings"
          :key="index"
          :hoverable="true"
          class="card-schedule"
        >
          <a-space direction="vertical" :size="5">
            <span class="bold large">
              <reconciliation-outlined /> {{ capitalizeEachWord(booking.meeting_name) }}
            </span>
            <a-space :size="1">
              <a-tag class="bold">
                <user-outlined /> {{ capitalizeEachWord(booking.username) }}
              </a-tag>
              <a-tag class="bold"> <UsergroupAddOutlined /> {{ booking.dept }} </a-tag>
              <a-tag class="bold">
                <clock-circle-outlined /> {{ booking.start.split(' ')[1].slice(0, 5) }} -
                {{ booking.end.split(' ')[1].slice(0, 5) }}
              </a-tag>
              <a-tag
                class="bold"
                :color="
                  booking.status === 'Cancel'
                    ? '#F75A5A'
                    : booking.status === 'Present'
                      ? '#018000'
                      : 'grey'
                "
              >
                {{ booking.status || 'On Schedule' }}
              </a-tag>
            </a-space>
          </a-space>
        </a-card>
      </a-flex>
      <a-flex
        justify="center"
        align="center"
        class="list-schedule"
        v-if="bookingStore.bookings.length === 0"
      >
        <a-empty description="There is no schedule" />
      </a-flex>
      <a-flex justify="center" align="center">
        <a-button type="primary" @click="router.back()"> Back to queue</a-button>
      </a-flex>
    </a-card>
  </a-flex>
</template>

<script setup>
import {
  ReconciliationOutlined,
  ClockCircleOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  CalendarOutlined,
} from '@ant-design/icons-vue'
import { useBookingStore } from '@/stores/bookings'
import { useRoomStore } from '@/stores/room'
import dayjs from 'dayjs'
import { onMounted, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'

const router = useRouter()
const route = useRoute()
const bookingStore = useBookingStore()
const roomStore = useRoomStore()
const selectedDate = ref(dayjs())
const roomData = ref(null)

const disabledDate = (current) => {
  return current && current < dayjs().startOf('day')
}

onMounted(async () => {
  await roomStore.get()
  roomData.value = roomStore.getRoomById(route.params.id_room)
})

watchEffect(async () => {
  if (!selectedDate.value || !route.params.id_room) return

  await bookingStore.get({
    id_room: route.params.id_room,
    date: selectedDate.value.format('YYYY-MM-DD'),
    status: 'All',
  })
})
</script>

<style scoped>
.schedule-info {
  height: 100dvh;
  background: #f0f2f5;
}

.card-wrapper {
  width: 1000px;
  height: 600px;
  border: 4px solid #264d8e;
}

.list-schedule {
  height: 490px;
  padding: 8px 8px 10px 0;
  overflow-y: auto;
}

.date-picker {
  width: 130px;
}

.card-schedule {
  border: 1px solid #d9d9d9;
}

.card-schedule:hover {
  border: 3px solid #264d8e;
  cursor: default;
}
</style>

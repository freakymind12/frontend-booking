<template>
  <BaseCardColumn :sm="24" :lg="24" :xl="24" title="Booking Schedule">
    <template #body>
      <!-- Filter -->
      <a-flex justify="flex-start" align="center" class="mb" gap="small" wrap="wrap">
        <a-space direction="vertical" :size="0">
          <span class="bold"> Room</span>
          <a-select
            class="select-option"
            v-model:value="filters.room"
            :options="roomStore.getRoomOptions"
          />
        </a-space>
        <a-space direction="vertical" :size="0">
          <span class="bold">Date</span>
          <a-date-picker v-model:value="filters.date" :allowClear="false" />
        </a-space>
      </a-flex>

      <!-- Booking Schedule -->
      <a-flex
        vertical
        :gap="5"
        class="wrapper-card-list mb"
        v-if="bookingStore.bookings.length > 0"
      >
        <a-card
          size="small"
          v-for="(booking, index) in bookingStore.bookings"
          :key="index"
          :hoverable="true"
        >
          <a-flex vertical :gap="2">
            <a-flex justify="space-between" align="center" wrap="wrap">
              <span class="bold"><UserOutlined /> {{ capitalizeEachWord(booking.username) }}</span>
              <span class="bold"><UsergroupAddOutlined /> {{ booking.dept }}</span>
            </a-flex>
            <span><ReconciliationOutlined /> {{ capitalizeEachWord(booking.meeting_name) }}</span>
            <a-flex justify="space-between" align="center" wrap="wrap">
              <a-flex :gap="10" wrap="wrap">
                <span
                  ><ClockCircleOutlined /> {{ booking.start.split(' ')[1].slice(0, 5) }} -
                  {{ booking.end.split(' ')[1].slice(0, 5) }}</span
                >
                <a-tag
                  class="bold"
                  :color="
                    booking.status === 'Cancel'
                      ? '#F75A5A'
                      : booking.status === 'Present'
                        ? '#018000'
                        : '#e9a319'
                  "
                >
                  {{ booking.status || 'On Schedule' }}
                </a-tag>
              </a-flex>
              <a-space :size="4" :wrap="true">
                <a-popconfirm
                  title="Are you sure to cancel this booking?"
                  @confirm="cancelBooking(booking)"
                >
                  <a-button
                    type="primary"
                    size="small"
                    class="secondary"
                    v-if="authStore.user.role !== 'viewer' && !booking.status"
                    >Cancel</a-button
                  >
                </a-popconfirm>
                <a-popconfirm
                  title="Are you sure to delete this booking?"
                  @confirm="deleteBooking(booking.id_booking)"
                >
                  <a-button
                    type="primary"
                    size="small"
                    danger
                    v-if="authStore.user.role === 'admin' && !booking.status"
                    >Delete</a-button
                  >
                </a-popconfirm>
              </a-space>
            </a-flex>
          </a-flex>
        </a-card>
      </a-flex>
      <a-flex justify="center" class="wrapper-card-list mb" align="center" v-else>
        <a-empty description="There is no booking data" />
      </a-flex>

      <span class="bold">Total : </span><span>{{ bookingStore.bookings.length }} Schedule</span>
    </template>
  </BaseCardColumn>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import BaseCardColumn from '@/components/BaseCardColumn.vue'
import { useBookingStore } from '@/stores/bookings'
import { useRoomStore } from '@/stores/room'
import { useAuthStore } from '@/stores/auth'
import {
  UsergroupAddOutlined,
  UserOutlined,
  ReconciliationOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'

const roomStore = useRoomStore()
const bookingStore = useBookingStore()
const authStore = useAuthStore()
const filters = ref({
  room: null,
  date: dayjs(),
})

const fetchBookings = async () => {
  await bookingStore.get({
    date: filters.value.date.format('YYYY-MM-DD'),
    id_room: filters.value.room,
  })
}

const cancelBooking = async (data) => {
  await bookingStore.update(data.id_booking, { ...data, status: 'Cancel' })
  fetchBookings()
  bookingStore.setUpdateUserBookings()
}

const deleteBooking = async (id) => {
  await bookingStore.delete(id)
  fetchBookings()
  bookingStore.setUpdateUserBookings()
}

watch(
  () => [filters.value.room, filters.value.date],
  async () => {
    await fetchBookings()
  },
)

watch(
  () => [bookingStore.updateBookings],
  async () => {
    await fetchBookings()
  },
)

onMounted(async () => {
  await roomStore.get()
  if (roomStore.rooms.length > 0) filters.value.room = roomStore.rooms[0].id_room
  await fetchBookings()
})
</script>

<style scoped>
.select-option {
  width: 250px;
}

.wrapper-card-list {
  height: 500px;
  padding: 5px 8px 5px 8px;
  overflow-y: auto;
}
</style>

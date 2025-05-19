<template>
  <BaseCardColumn size="small" :xs="24" :lg="24" :xl="24">
    <template #body>
      <a-flex vertical :gap="0">
        <a-flex justify="space-between" align="center">
          <span class="bold x-large">{{ props.data.room_name }}</span>
          <a-tag color="blue" class="bold">{{ currentBooking.length }} Schedule</a-tag>
        </a-flex>
        <a-flex align="center" gap="small" class="wrapper-card-booking">
          <a-card
            size="small"
            :hoverable="true"
            v-for="book in currentBooking"
            :key="book.id_booking"
            class="card-booking"
            :class="{ active: isBookingActive(book.start, book.end) }"
          >
            <a-flex vertical :gap="1">
              <span><UserOutlined /> {{ book.username }}</span>
              <span
                ><ClockCircleOutlined /> {{ book.start.split(' ')[1].slice(0, 5) }} -
                {{ book.end.split(' ')[1].slice(0, 5) }}</span
              >
              <span class="ellipsis-text"><ReconciliationOutlined /> {{ capitalizeEachWord(book.meeting_name) }}</span>
            </a-flex>
          </a-card>
        </a-flex>
        <a-flex justify="center" align="center" gap="small" v-if="currentBooking.length == 0">
          <a-card size="small" :hoverable="true" class="empty-schedule">
            <span>No Schedule</span>
          </a-card>
        </a-flex>
      </a-flex>
    </template>
  </BaseCardColumn>
</template>

<script setup>
import BaseCardColumn from '@/components/BaseCardColumn.vue'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import { useBookingStore } from '@/stores/bookings'
import { computed } from 'vue'
import { UserOutlined, ClockCircleOutlined, ReconciliationOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
const bookingStore = useBookingStore()

const currentBooking = computed(() => {
  return bookingStore.getBookingByIdRoom(props.data.id_room)
})

const isBookingActive = (start, end) => {
  const now = dayjs()
  const startTime = dayjs(start)
  const endTime = dayjs(end)
  return now.isAfter(startTime) && now.isBefore(endTime)
}

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
})
</script>

<style scoped>
.wrapper-card-booking {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 5px 5px 5px 5px;
}

.card-booking {
  flex: 0 0 auto;
  width: 250px;
  height: 90px;
}

.active {
  background-color: #e6f4ff;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(38, 77, 142, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(38, 77, 142, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(38, 77, 142, 0);
  }
}

.ellipsis-text {
  display: block; /* penting: biar bisa diatur width */
  width: 100%; /* batasi lebar ke container */
  overflow: hidden; /* potong isi yg kepanjangan */
  text-overflow: ellipsis; /* munculkan ... */
  white-space: nowrap; /* cegah turun ke bawah */
}

.empty-schedule {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

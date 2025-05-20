<template>
  <a-card size="small" class="room-info">
    <a-space direction="vertical" :size="10">
      <!-- Header -->
      <a-flex justify="center" align="center" gap="middle" class="mb">
        <a-image :src="hrs" :height="80" :preview="false" />
        <span class="xx-large bold">Meeting Room <br />Management</span>
      </a-flex>

      <!-- Button Room and Schedule -->
      <a-flex justify="center" align="center" gap="small">
        <a-dropdown>
          <a-button type="primary" class="button-room large bold" shape="round">{{
            roomData?.room_name
            }}</a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="room in roomStore.rooms" :key="room.id_room" @click="handleChangeRoom(room.id_room)">
                {{ room?.room_name }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-tooltip title="See Schedule">
          <a-button type="primary" shape="circle" class="button-schedule large" @click="goToScheduleInfo">
            <ScheduleOutlined />
          </a-button>
        </a-tooltip>
      </a-flex>

      <!-- Room Info -->
      <a-row :gutter="[16, 8]" class="mt" :wrap="true">
        <a-col :span="20">
          <a-statistic :value="roomData?.description" :value-style="{ fontSize: '16px' }">
            <template #title>
              <span class="bold large"> Description </span>
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="4">
          <a-statistic :value="Number(roomData?.capacity).toLocaleString('id-ID')" :value-style="{ fontSize: '16px' }">
            <template #title>
              <span class="bold large"> Capacity </span>
            </template>
            <template #prefix>
              <span class="bold large">
                <UserOutlined />
              </span>
            </template>
          </a-statistic>
        </a-col>
      </a-row>

      <!-- Ongoing and Upcoming -->
      <a-row :gutter="[16, 16]" :wrap="true">
        <a-col :span="24" class="ongoing-upcoming">
          <a-statistic :value="capitalizeEachWord(ongoing?.meeting_name || 'No Schedule')"
            :value-style="{ fontSize: '16px' }">
            <template #title>
              <span class="bold large"> Ongoing </span>
            </template>
            <template #prefix>
              <span class="bold large">
                <ReconciliationOutlined />
              </span>
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="24" class="ongoing-upcoming">
          <a-statistic :value="capitalizeEachWord(upcoming?.meeting_name || 'No Schedule')"
            :value-style="{ fontSize: '16px' }">
            <template #title>
              <span class="bold large"> Upcoming </span>
            </template>
            <template #prefix>
              <span class="bold large">
                <ReconciliationOutlined />
              </span>
            </template>
          </a-statistic>
        </a-col>
      </a-row>

      <!-- Action Button -->
      <a-flex justify="center" gap="small" class="mt">
        <a-button type="primary" size="large" class="action-button" :disabled="!ongoing" v-if="!ongoing?.status"
          @click="handleConfirmation(ongoing, 'Present')">
          <span class="bold">
            <CheckCircleOutlined /> Present
          </span>
        </a-button>
        <a-button type="primary" danger size="large" class="action-button" :disabled="!ongoing" v-if="!ongoing?.status"
          @click="handleConfirmation(ongoing, 'Cancel')">
          <span class="bold">
            <CloseCircleOutlined /> Cancel
          </span>
        </a-button>
        <a-button block size="large" type="primary" class="ongoing-button green"
          v-if="ongoing?.status === 'Present'">Meeting
          is ongoing</a-button>
      </a-flex>

      <!-- Date Time -->
      <a-flex justify="center" gap="small" class="card-footer">
        <span class="clocking-time "> {{ dateNow }} </span>
      </a-flex>
    </a-space>
  </a-card>

  <Teleport to="body">
    <BaseModal :visible="modalData.visible" :modal-title="modalData.title" @close="handleClose">
      <template #body>
        <ModalConfirmation :data="modalData.data" :mode="modalData.mode" @close="handleClose"
          @present="updateStatusBookings('Present')" @cancel="updateStatusBookings('Cancel')" />
      </template>
    </BaseModal>
  </Teleport>
</template>

<script setup>
import hrs from '@/assets/images/hrs.png'
import {
  ScheduleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReconciliationOutlined,
} from '@ant-design/icons-vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import BaseModal from '@/components/BaseModal.vue'
import ModalConfirmation from './ModalConfirmation.vue'
import { useRoomStore } from '@/stores/room'
import { useBookingStore } from '@/stores/bookings'
import { useRoute, useRouter } from 'vue-router'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import { useCurrentDate } from '@/composable/currentDate'

const { dateNow } = useCurrentDate()
dayjs.extend(isSameOrAfter)
let refreshBookingInterval
const bookingStore = useBookingStore()
const roomStore = useRoomStore()
const router = useRouter()
const route = useRoute()
const roomData = ref()
const ongoing = ref()
const upcoming = ref()

const modalData = ref({
  visible: false,
  data: null,
  mode: null,
  title: ''
})


const openModal = ({ title, data = null, mode }) => {
  modalData.value = {
    visible: true,
    title,
    data,
    mode,
  }
}

const handleConfirmation = (item, status = null) => {
  openModal({ title: 'Confirmation Bookings', data: item, mode: status })
}

const handleClose = (isVisible) => {
  modalData.value.visible = isVisible
}

const handleChangeRoom = (roomId) => {
  router.push(`/queue/${roomId}`)
}

const goToScheduleInfo = () => {
  router.push(`/queue/${route.params.id_room}/schedule`)
}

const updateOngoingandUpcoming = () => {
  const now = dayjs()

  const bookings = bookingStore.sortedAscBookings

  const validBookings = bookings.filter((booking) => booking.status !== 'Cancel')

  ongoing.value = validBookings.find((booking) => {
    const start = dayjs(booking.start)
    const end = dayjs(booking.end)
    return now >= start && now <= end
  })

  if (ongoing.value) {
    const endTime = dayjs(ongoing.value.end)
    upcoming.value = validBookings.find((booking) => {
      return dayjs(booking.start).isSameOrAfter(endTime)
    })
  } else {
    upcoming.value = validBookings.find((booking) => {
      return dayjs(booking.start).isAfter(dayjs())
    })
  }
}

const updateStatusBookings = async (status) => {
  await bookingStore.update(ongoing.value.id_booking, { ...ongoing.value, status })
  await bookingStore.get({
    id_room: route.params.id_room,
    date: dayjs().format('YYYY-MM-DD'),
    status: 'All',
  })
}

watch(
  () => route.params.id_room,
  async (newRoom) => {
    roomData.value = roomStore.getRoomById(newRoom)
    await bookingStore.get({
      id_room: newRoom,
      date: dayjs().format('YYYY-MM-DD'),
      status: 'All',
    })
  },
)

onMounted(async () => {
  await roomStore.get()
  roomData.value = roomStore.getRoomById(route.params.id_room)

  // clocking time
  setInterval(() => {
    updateOngoingandUpcoming()
  }, 1000)

  refreshBookingInterval = setInterval(async () => {
    await bookingStore.get({
      id_room: route.params.id_room,
      date: dayjs().format('YYYY-MM-DD'),
      status: 'All',
    })
  }, 5000)
})

onUnmounted(() => {
  clearInterval(refreshBookingInterval)
})
</script>

<style scoped>
.ongoing-button {
  height: 75px;
}

.action-button {
  height: 75px;
  width: 150px;
}

.room-info {
  height: 600px;
  width: 640px;
  border: 4px solid #264d8e;
}

.button-room {
  width: 560px;
  height: 40px;
}

.button-schedule {
  height: 40px;
  width: 40px;
}

.mt {
  margin-top: 8px;
}

.green {
  background-color: green;
}

.green:hover {
  background-color: rgb(5, 165, 5);
}

.clocking-time {
  font-size: 16px;
}

.card-footer {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
}
</style>

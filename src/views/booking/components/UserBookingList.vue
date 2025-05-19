<template>
  <BaseCardColumn :sm="24" :lg="24" :xl="24" title="Your Booking List">
    <template #body>
      <!-- Filter -->
      <a-flex justify="flex-start" align="end" class="mb" gap="small" wrap="wrap">
        <a-space direction="vertical" :size="0">
          <span class="bold"> Search</span>
          <a-input class="search-input" placeholder="Keywords" v-model:value="searchInput">
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
        </a-space>
        <a-button type="primary" @click="handleAdd">New Booking</a-button>
      </a-flex>

      <!-- User Booking List -->
      <a-flex vertical :gap="5" class="wrapper-card-list" v-if="filteredUserBookings.length > 0">
        <a-card
          size="small"
          v-for="(booking, index) in filteredUserBookings"
          :key="index"
          :hoverable="true"
        >
          <a-flex vertical :gap="2">
            <span class="bold"
              ><ReconciliationOutlined /> {{ capitalizeEachWord(booking.meeting_name) }}</span
            >
            <a-flex justify="space-between" align="center" wrap="wrap">
              <a-space :size="0" :wrap="true">
                <a-tag><CalendarOutlined /> {{ booking.start.split(' ')[0] }}</a-tag>
                <a-tag
                  ><ClockCircleOutlined /> {{ booking.start.split(' ')[1].slice(0, 5) }} -
                  {{ booking.end.split(' ')[1].slice(0, 5) }}</a-tag
                >
                <a-tag><HomeOutlined /> {{ booking.room_name }}</a-tag>
                <a-tag
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
              </a-space>
              <!-- action button -->
              <a-space :size="0" v-if="!booking.status">
                <a-tag color="#E9A319" class="action-button" @click="handleEdit(booking)"
                  ><EditOutlined
                /></a-tag>
                <a-popconfirm
                  title="Are you sure to delete this booking?"
                  @confirm="handleDelete(booking.id_booking)"
                >
                  <a-tag color="#F75A5A" class="action-button"><DeleteOutlined /></a-tag>
                </a-popconfirm>
              </a-space>
            </a-flex>
          </a-flex>
        </a-card>
      </a-flex>

      <a-flex justify="center" align="center" class="wrapper-card-list" v-else>
        <a-empty description="No Booking Data" />
      </a-flex>

      <!-- Modal -->
      <Teleport to="body">
        <BaseModal :visible="modalData.visible" :modal-title="modalData.title" @close="handleClose">
          <template #body>
            <BookingForm
              :data="modalData.data"
              :mode="modalData.mode"
              @close="handleClose"
              @update-booking-user="updateUserBooking"
            />
          </template>
        </BaseModal>
      </Teleport>

      <!-- Total Booking User -->
      <span class="bold">Total : </span><span>{{ filteredUserBookings.length }} Schedule</span>
    </template>
  </BaseCardColumn>
</template>

<script setup>
import BaseCardColumn from '@/components/BaseCardColumn.vue'
import { computed, onMounted, ref, watch } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import BookingForm from './BookingForm.vue'
import { useBookingStore } from '@/stores/bookings'
import { useAuthStore } from '@/stores/auth'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import {
  CalendarOutlined,
  ReconciliationOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  HomeOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons-vue'

const searchInput = ref(null)
const authStore = useAuthStore()
const bookingStore = useBookingStore()
const modalData = ref({
  visible: false,
  mode: null,
  data: null,
  title: '',
})

const filteredUserBookings = computed(() => bookingStore.filterUserBookings(searchInput.value))

const openModal = ({ title, data = null, mode }) => {
  modalData.value = {
    visible: true,
    title,
    data,
    mode,
  }
}

const updateUserBooking = async () => {
  await bookingStore.get({ id_user: authStore.user.id_user })
}

const handleEdit = (item) => {
  openModal({ title: 'Edit Booking', data: item, mode: 'edit' })
}

const handleAdd = () => {
  openModal({ title: 'Create New Booking', mode: 'add' })
}

const handleDelete = async (id) => {
  await bookingStore.delete(id)
  await updateUserBooking()
  bookingStore.setUpdateBookings()
}

const handleClose = (isVisible) => {
  modalData.value.visible = isVisible
}

onMounted(async () => {
  await updateUserBooking()
})

watch(
  () => [bookingStore.updateUserBookings],
  async () => {
    await updateUserBooking()
  },
)
</script>

<style scoped>
.search-input {
  width: 250px;
}

.wrapper-card-list {
  height: 500px;
  padding: 5px 8px 5px 8px;
  overflow-y: auto;
  overflow-x: hidden;
}

.action-button {
  transition: transform 0.2s ease-in-out;
}

.action-button:hover {
  cursor: pointer;
  transform: scale(1.1);
}
</style>

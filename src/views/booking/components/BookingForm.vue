<template>
  <a-form layout="vertical" :model="formState" @finish="handleAction(props.mode)">
    <a-form-item label="Room" name="id_room"
      :rules="[{ required: true, message: 'Please select room', trigger: 'change' }]">
      <a-select class="select-option" v-model:value="formState.id_room" :options="roomStore.getRoomOptions"
        :disabled="props.mode === 'delete'" />
    </a-form-item>
    <a-form-item label="Meeting Name" name="meeting_name"
      :rules="[{ required: true, message: 'Please input meeting name', trigger: 'change' }]">
      <a-textarea v-model:value="formState.meeting_name" :showCount="true" :maxLength="100"
        :disabled="props.mode === 'delete'" />
    </a-form-item>
    <a-form-item label="Start & End Time" name="date_range" :rules="[
      { required: true, message: 'Please select start and end time', trigger: 'change' },
      { validator: validateSameDay, trigger: 'change' },
    ]">
      <a-range-picker :show-time="{ format: 'HH:mm' }" format="YYYY-MM-DD HH:mm"
        :placeholder="['Start Time', 'End Time']" v-model:value="formState.date_range" class="range-picker"
        :allowClear="false" :disabled-date="disabledDate" />
    </a-form-item>

    <transition name="fade-slide" appear>
      <a-alert :message="errorMessage" v-if="errorMessage" class="mb" type="error" show-icon />
    </transition>

    <a-flex justify="flex-end" gap="small">
      <a-button type="default" @click="emit('close')">Close</a-button>
      <a-button type="primary" :danger="props.mode === 'delete'" html-type="submit">Submit</a-button>
    </a-flex>
  </a-form>
</template>

<script setup>
import { useRoomStore } from '@/stores/room'
import { useBookingStore } from '@/stores/bookings'
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const bookingStore = useBookingStore()
const roomStore = useRoomStore()
const errorMessage = ref()

const emit = defineEmits(['close', 'update-booking-user'])

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
  mode: {
    type: String,
    default: 'add',
  },
})

const formState = ref({
  id_room: props.data?.id_room || null,
  meeting_name: props.data?.meeting_name || null,
  date_range:
    props.data?.start && props.data?.end ? [dayjs(props.data.start), dayjs(props.data.end)] : [],
})

const resetForm = (data) => {
  formState.value = {
    id_room: data?.id_room || null,
    meeting_name: data?.meeting_name || null,
    date_range: data?.start && data?.end ? [dayjs(data.start), dayjs(data.end)] : [],
  }
}

const handleAction = async (mode) => {
  if (mode === 'add') {
    const { date_range, ...payload } = formState.value
    const [start, end] = date_range

    const response = await bookingStore.create({
      ...payload,
      start: dayjs(start).format('YYYY-MM-DD HH:mm'),
      end: dayjs(end).format('YYYY-MM-DD HH:mm'),
      id_user: authStore.user.id_user,
    })

    emit('update-booking-user')
    bookingStore.setUpdateBookings()

    if (response.code == 400) {
      errorMessage.value = response.message
    } else {
      resetForm()
      errorMessage.value = null
      emit('close')
    }
  }

  if (mode === 'edit') {
    const { date_range, ...payload } = formState.value
    const [start, end] = date_range

    const response = await bookingStore.update(props.data.id_booking, {
      ...payload,
      start: dayjs(start).format('YYYY-MM-DD HH:mm'),
      end: dayjs(end).format('YYYY-MM-DD HH:mm'),
      id_user: authStore.user.id_user,
    })

    emit('update-booking-user')
    bookingStore.setUpdateBookings()

    if (response.code == 400) {
      errorMessage.value = response.message
    } else {
      errorMessage.value = null
      emit('close')
    }
  }
}

// validasi untuk range picker harus sama hari
const validateSameDay = (_, value) => {
  const [start, end] = value || []

  if (!start || !end) {
    return Promise.resolve() // Tidak validasi kalau belum lengkap
  }

  if (!dayjs(start).isSame(dayjs(end), 'day')) {
    return Promise.reject('Start and end time must be on the same day')
  }

  return Promise.resolve()
}

// disabled date range sebelum today dan setelah + 1 minggu dari today
const disabledDate = (current) => {
  const now = dayjs()
  const duration = now.add(14, 'day')

  // Disable jika tanggal current sebelum sekarang (hari ini) atau setelah 7 hari dari sekarang
  return current.isBefore(now, 'day') || current.isAfter(duration, 'day')
}

watch(
  () => props.data,
  (newValue) => {
    resetForm(newValue)
  },
)
</script>

<style scoped>
.range-picker {
  width: 100%;
}

.select-option {
  width: 100%;
}

.mb {
  margin-bottom: 16px;
}

.fade-slide-enter-active {
  transition: all 0.3s ease;
}

.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

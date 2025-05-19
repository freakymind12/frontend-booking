<template>
  <a-form layout="vertical" :model="formState" @finish="handleAction(props.mode)">
    <a-form-item
      label="Meeting Name"
      name="meeting_name"
      :rules="[{ required: true, message: 'Please input meeting name', trigger: 'change' }]"
    >
      <a-input v-model:value="formState.meeting_name" :disabled="props.mode === 'delete'" />
    </a-form-item>
    <a-form-item
      label="Room"
      name="id_room"
      :rules="[
        { required: true, message: 'Please select room', trigger: 'change' },
        { validator: validateConflict, trigger: 'change' },
      ]"
    >
      <a-select
        class="select-option"
        v-model:value="formState.id_room"
        :options="roomStore.getRoomOptions"
        :disabled="props.mode === 'delete'"
      />
    </a-form-item>
    <a-form-item
      label="PIC Meeting"
      name="id_user"
      :rules="[{ required: true, message: 'Please select PIC meeting', trigger: 'change' }]"
    >
      <a-select
        class="select-option"
        show-search
        :filter-option="filterOption"
        v-model:value="formState.id_user"
        :options="userStore.getUserOptions"
        :disabled="props.mode === 'delete'"
      />
    </a-form-item>
    <a-row :gutter="[8, 8]">
      <a-col :span="12">
        <a-form-item
          label="Day"
          name="day"
          :rules="[
            { required: true, message: 'Please select day', trigger: 'change' },
            { validator: validateConflict, trigger: 'change' },
          ]"
        >
          <a-select
            class="select-option"
            v-model:value="formState.day"
            :options="daysOfWeek"
            :disabled="props.mode === 'delete'"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Time Range"
          name="time_range"
          :rules="[
            { required: true, message: 'Please input time range', trigger: 'change' },
            { validator: validateConflict, trigger: 'change' },
          ]"
        >
          <a-time-range-picker
            v-model:value="formState.time_range"
            format="HH:mm"
            class="select-option"
            :allowClear="false"
            :placeholder="['', '']"
            :disabled="props.mode === 'delete'"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8"></a-col>
    </a-row>
    <a-flex justify="flex-end" gap="small">
      <a-button type="default" @click="emit('close')">Close</a-button>
      <a-button type="primary" :danger="props.mode === 'delete'" html-type="submit"
        >Submit</a-button
      >
    </a-flex>
  </a-form>
</template>

<script setup>
import { useRoomStore } from '@/stores/room'
import { useAutoScheduleStore } from '@/stores/autoSchedule'
import { useUserStore } from '@/stores/users'
import { ref, watch } from 'vue'
import dayjs from 'dayjs'

const roomStore = useRoomStore()
const autoScheduleStore = useAutoScheduleStore()
const userStore = useUserStore()

const emit = defineEmits(['close'])

const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
  const dayValue = (i + 1) % 7 // Geser agar Monday = 1, Sunday = 0
  return {
    value: dayValue,
    label: dayjs().day(dayValue).format('dddd'),
  }
})

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
  time_range:
    props.data?.start && props.data?.end
      ? [dayjs(props.data.start, 'HH:mm'), dayjs(props.data.end, 'HH:mm')]
      : [],
  day: props.data?.day || null,
  id_user: props.data?.id_user || null,
  meeting_name: props.data?.meeting_name || null,
})

const resetForm = (data) => {
  formState.value = {
    id_room: data?.id_room || null,
    time_range:
      data?.start && data?.end ? [dayjs(data.start, 'HH:mm'), dayjs(data.end, 'HH:mm')] : [],
    day: data?.day || null,
    id_user: data?.id_user || null,
    meeting_name: data?.meeting_name || null,
  }
}

const handleAction = async (mode) => {
  if (mode === 'add') {
    const { time_range, ...payload } = formState.value
    const start = dayjs(time_range[0]).format('HH:mm')
    const end = dayjs(time_range[1]).format('HH:mm')
    console.log(start, end)
    await autoScheduleStore.create({
      ...payload,
      start,
      end,
    })
    resetForm()
  }
  if (mode === 'edit') {
    const { time_range, ...payload } = formState.value
    const start = dayjs(time_range[0]).format('HH:mm')
    const end = dayjs(time_range[1]).format('HH:mm')

    await autoScheduleStore.update(props.data?.id_schedule, {
      ...payload,
      start,
      end,
    })
  }
  if (mode === 'delete') {
    await autoScheduleStore.delete(props.data?.id_schedule)
  }
  emit('close')
}

// Validator fungsi untuk memeriksa konflik waktu pada form auto schedule
const validateConflict = async () => {
  if (props.mode === 'delete') return Promise.resolve()

  const { day, time_range, id_room } = formState.value

  if (!day || !id_room || !time_range || time_range.length !== 2) return Promise.resolve()

  const start = time_range[0]?.format('HH:mm')
  const end = time_range[1]?.format('HH:mm')

  if (!start || !end) return Promise.resolve()

  const conflicted = autoScheduleStore.getConflictedSchedules(day, start, end, id_room)

  if (conflicted.length > 0) {
    return Promise.reject(new Error('Schedule conflict with existing data'))
  }

  return Promise.resolve()
}

const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

watch(
  () => props.data,
  (newVal) => {
    resetForm(newVal)
  },
)
</script>

<style scoped>
.select-option {
  width: 100%;
}
</style>

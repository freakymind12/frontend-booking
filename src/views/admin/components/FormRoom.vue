<template>
  <a-form layout="vertical" :model="formState" @finish="handleAction(props.mode)">
    <a-form-item
      label="Room Name"
      name="room_name"
      :rules="[{ required: true, message: 'Please input room name', trigger: 'change' }]"
    >
      <a-input v-model:value="formState.room_name" :disabled="props.mode === 'delete'" />
    </a-form-item>
    <a-form-item
      label="Capacity"
      name="capacity"
      :rules="[{ required: true, message: 'Please input room capacity', trigger: 'change' }]"
    >
      <a-input-number
        style="width: 100%"
        :min="1"
        v-model:value="formState.capacity"
        :disabled="props.mode === 'delete'"
      />
    </a-form-item>
    <a-form-item
      label="Description"
      name="description"
      :rules="[{ required: true, message: 'Please input room description', trigger: 'change' }]"
    >
      <a-textarea
        v-model:value="formState.description"
        :showCount="true"
        :maxLength="100"
        placeholder="maximum is 100 characters"
        :disabled="props.mode === 'delete'"
      />
    </a-form-item>
    <a-flex justify="flex-end" gap="small">
      <a-button type="default" @click="emit('close')">Cancel</a-button>
      <a-button type="primary" :danger="props.mode === 'delete'" html-type="submit"
        >Submit</a-button
      >
    </a-flex>
  </a-form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoomStore } from '@/stores/room'

const roomStore = useRoomStore()

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: null,
  },
})
const formState = ref({
  room_name: props.data?.room_name || null,
  capacity: props.data?.capacity || null,
  description: props.data?.description || null,
})

const emit = defineEmits(['close'])

const resetForm = (data) => {
  formState.value = {
    room_name: data?.room_name || null,
    capacity: data?.capacity || null,
    description: data?.description || null,
  }
}

const handleAction = async (mode) => {
  if (mode === 'add') {
    await roomStore.create(formState.value)
    resetForm()
  }
  if (mode === 'edit') {
    await roomStore.update(props.data.id_room, formState.value)
  }
  if (mode === 'delete') {
    await roomStore.delete(props.data.id_room)
  }
  emit('close')
}

watch(
  () => props.data,
  (newVal) => {
    resetForm(newVal)
  },
)
</script>

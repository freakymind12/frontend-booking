<template>
  <a-modal v-bind:open="props.visible" :footer="null" @cancel="emits('close')" centered>
    <h2>Edit room data</h2>
    <a-form layout="vertical" :model="form" @finish="handleEdit(props.room.id_room)">
      <a-form-item label="Room name" name="room_name" :rules="[{ required: true }]">
        <a-input placeholder="Room Name" v-model:value="form.room_name" />
      </a-form-item>
      <a-form-item label="Capacity" name="capacity" :rules="[{ required: true }]">
        <a-input-number placeholder="Capacity" v-model:value="form.capacity" style="width: 100%" />
      </a-form-item>
      <a-form-item label="Description" name="description" :rules="[{ required: true }]">
        <a-input placeholder="Description" v-model:value="form.description" />
      </a-form-item>
      <a-form-item>
        <a-flex justify="flex-end">
          <a-space :size="10">
            <a-button
              type="primary"
              html-type="submit"
              :disabled="form.room_name === '' || form.capacity === '' || form.description === ''"
            >
              Submit
            </a-button>
          </a-space>
        </a-flex>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { message } from 'ant-design-vue'

const form = ref({
  room_name: '',
  capacity: '',
  description: ''
})

const emits = defineEmits(['close', 'edit'])
const props = defineProps({
  visible: Boolean,
  room: Object
})

const handleEdit = async (id) => {
  try {
    await axios.patch(`http://192.168.148.125:5151/rooms/${id}`, {
      room_name: form.value.room_name,
      capacity: form.value.capacity,
      description: form.value.description
    })
    emits('edit')
    emits('close')
    message.success('Success edit room data')
  } catch (error) {
    console.error(error)
  }
}

const handleReset = () => {
  form.value = {
    room_name: '',
    capacity: '',
    description: ''
  }
}

watch(
  () => props.room,
  (newRoom) => {
    if (newRoom) {
      form.value.room_name = newRoom.room_name || ''
      form.value.capacity = newRoom.capacity || ''
      form.value.description = newRoom.description || ''
    } else {
      handleReset()
    }
  },
  { immediate: true }
)
</script>

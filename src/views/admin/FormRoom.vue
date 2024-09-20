<template>
  <a-card class="form-room-card">
    <h2>Fill this form to add a new room</h2>
    <a-form layout="vertical" :model="form" @finish="handleAddRoom">
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
              @click="handleReset"
              :disabled="form.room_name === '' || form.capacity === '' || form.description === ''"
              >Reset</a-button
            >
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
  </a-card>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { message } from 'ant-design-vue'

const emits = defineEmits(['add-room'])

const form = ref({
  room_name: '',
  capacity: '',
  description: ''
})

const handleReset = () => {
  form.value = {
    room_name: '',
    capacity: '',
    description: ''
  }
}

const handleAddRoom = async () => {
  try {
    await axios.post('http://192.168.148.125:5151/rooms', {
      room_name: form.value.room_name,
      capacity: form.value.capacity,
      description: form.value.description
    })
    emits('add-room')
    handleReset()
    message.success('Success add a new room')
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
.form-room-card {
  height: 600px;
  overflow-y: auto;
  padding-right: 8px;
  border: solid #264d8e 1px;
}

.form-room-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transform: scale(1.02);
}

.form-room-card::-webkit-scrollbar {
  display: none;
}
</style>

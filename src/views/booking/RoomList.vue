<template>
  <a-col :span="6">
    <a-row gutter="24" class="scrollable-column">
      <a-col :span="24" v-if="rooms.length === 0">
        <a-card class="empty-card">
          <a-empty>
            <template #description>
              <p>There is no room data</p>
            </template>
          </a-empty>
        </a-card>
      </a-col>
      <a-col :span="24" v-for="room in rooms" :key="room.id">
        <a-card class="room-card">
          <h2>{{ room.room_name }}</h2>
          <p><UserOutlined /> {{ room.capacity.toLocaleString() }} persons</p>
          <p style="margin-bottom: 4px"><BankOutlined /> {{ room.description }}</p>
          <a-button type="primary" @click="emits('select-room', room)">See Schedule</a-button>
        </a-card>
      </a-col>
    </a-row>
  </a-col>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { UserOutlined, BankOutlined } from '@ant-design/icons-vue'
import axios from 'axios'

const rooms = ref([])

const emits = defineEmits(['select-room'])

const fetchRoom = async () => {
  try {
    const response = await axios.get('http://192.168.148.125:5151/rooms')
    rooms.value = response.data.data
    if (rooms.value.length > 0) {
      emits('select-room', rooms.value[0])
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchRoom()
})
</script>

<style scoped>
.room-card {
  padding: 24px;
  background-color: #ffffff;
  margin-bottom: 1rem;
  border: solid #264d8e 1px;
}

.room-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transform: scale(1.02);
}

.room-card p {
  margin: 0;
}

.scrollable-column {
  height: 600px;
  overflow: auto; /* Mengizinkan scroll */
  scrollbar-width: none; /* Firefox */
}

/* Untuk WebKit (Chrome, Safari) */
.scrollable-column::-webkit-scrollbar {
  display: none; /* Menyembunyikan scrollbar */
}

.empty-card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* Sesuaikan height card dengan parent */
  min-height: 600px; /* Sama dengan tinggi scrollable-column */
}
</style>

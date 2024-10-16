<template>
  <!-- <a-col :span="6"> -->
  <div class="wrapper-room-list">
    <h2>Room List</h2>
    <a-row gutter="24" class="scrollable-column">
      <a-col :span="24" v-if="rooms.length === 0">
        <div class="empty-card">
          <a-empty description="No Room Data" />
        </div>
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
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { UserOutlined, BankOutlined } from '@ant-design/icons-vue'
import axios from 'axios'

const rooms = ref([])

const emits = defineEmits(['select-room'])

const fetchRoom = async () => {
  try {
    const response = await axios.get('http://192.168.148.201:5050/rooms')
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

.room-card p {
  margin: 0;
}

.scrollable-column {
  height: 510px;
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
  height: 100%;
  width: 360px;
}

.wrapper-room-list {
  max-width: 400px;
  padding: 20px;
  border: 1px solid #264d8e;
  border-radius: 10px;
  height: 600px;
}
</style>

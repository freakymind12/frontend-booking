<template>
  <a-col :span="6">
    <a-row gutter="24" class="scrollable-column">
      <a-col :span="24" v-for="room in rooms" :key="room.id">
        <a-card class="room-card">
          <h2>{{ room.name }}</h2>
          <p><UserOutlined /> {{ room.capacity }} persons</p>
          <p style="margin-bottom: 4px"><BankOutlined /> {{ room.description }}</p>
          <a-button type="primary">Book Now</a-button>
        </a-card>
      </a-col>
    </a-row>
  </a-col>
</template>

<script setup>
import { ref } from 'vue'
import { UserOutlined, BankOutlined } from '@ant-design/icons-vue'
const rooms = ref([
  { id: 1, name: 'Room A', capacity: 10, description: 'A medium-sized meeting room' },
  { id: 2, name: 'Room B', capacity: 8, description: 'A cozy small meeting room' },
  { id: 3, name: 'Room C', capacity: 15, description: 'A large meeting room with a projector' },
  { id: 4, name: 'Room D', capacity: 20, description: 'A large meeting room with a projector' }
  // Tambahkan data room lainnya
])
</script>

<style scoped>
.room-card {
  padding: 24px;
  background-color: #ffffff;
  margin-bottom: 1rem;
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
</style>

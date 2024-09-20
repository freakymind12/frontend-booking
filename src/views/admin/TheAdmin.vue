<template>
  <div class="banner">
    <h1>Admin Page</h1>
    <p>Manage your meeting room easily</p>
  </div>
  <div class="wrapper">
    <a-flex gap="large" align="center" justify="center">
      <FormRoom @add-room="handleAddRoom" />
      <RoomList :refreshKey="refreshKey" />
    </a-flex>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormRoom from './FormRoom.vue'
import RoomList from './RoomList.vue'
const refreshKey = ref(0)

const handleAddRoom = () => {
  refreshKey.value++
}
</script>

<style scoped>
.banner {
  text-align: center;
  margin-bottom: 40px;
}
.banner h1 {
  font-size: 2.5rem;
}
.banner p {
  font-size: 1rem;
}

.card-admin {
  height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

.card-admin::-webkit-scrollbar {
  display: none;
}
</style>

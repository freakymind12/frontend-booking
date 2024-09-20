<template>
  <div class="banner">
    <h1>Booking Your Room</h1>
    <p>See available room bellow, and make your booking room</p>
  </div>
  <div class="wrapper">
    <a-flex justify="space-around" align="center" wrap="wrap">
      <FormBooking @add-bookings="handleAdd" />
      <RoomList @select-room="handleSelectRoom" />
      <RoomSchedule :room="selectedRoom" :refreshKey="refreshKey" />
      <BookingList :refreshKey="refreshKey" @delete-booking="handleDelete" />
    </a-flex>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BookingList from './BookingList.vue'
import FormBooking from './FormBooking.vue'
import RoomList from './RoomList.vue'
import RoomSchedule from './RoomSchedule.vue'
import { message } from 'ant-design-vue'

const refreshKey = ref(0)
const selectedRoom = ref('')

const handleDelete = () => {
  refreshKey.value++
  message.success('Delete booking data success')
}
const handleAdd = () => {
  refreshKey.value++
  message.success('Add booking data success')
}

const handleSelectRoom = (room) => {
  selectedRoom.value = room
}
</script>

<style scoped>
.banner {
  text-align: center;
}
.banner h1 {
  font-size: 2.5rem;
}
.banner p {
  font-size: 1rem;
}
.wrapper {
  padding: 20px;
}
</style>

<template>
  <div class="banner">
    <h1>Booking Your Room</h1>
    <p>See available room bellow, and make your booking room</p>
  </div>
  <div class="wrapper">
    <a-row :gutter="16">
      <FormBooking />
      <RoomList />
      <BookingList />
    </a-row>
  </div>
</template>

<script setup>
import BookingList from './BookingList.vue'
import FormBooking from './FormBooking.vue'
import RoomList from './RoomList.vue'
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

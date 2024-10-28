<template>
  <div class="banner">
    <h1>Welcome to Room Booking Queue System</h1>
    <p>Efficiently manage your room bookings with our real-time queue system.</p>
  </div>
  <div class="wrapper">
    <a-flex gap="middle" align="center" justify="center">
      <CardFeatures />
      <CardQueue />
    </a-flex>
  </div>
</template>

<script setup>
import CardFeatures from './CardFeatures.vue'
import CardQueue from './CardQueue.vue'
</script>

<style scoped>
.banner {
  text-align: center;
}

.banner h1 {
  font-size: 2.5rem;
}
.banner p {
  font-size: 18px;
}

.wrapper {
  padding-top: 1.5rem;
}
</style>

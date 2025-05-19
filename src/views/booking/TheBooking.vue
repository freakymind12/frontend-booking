<template>
  <a-row :gutter="[8, 8]" :wrap="true">
    <a-col :sm="24" :lg="12" :xl="12">
      <a-row>
        <BookingSchedule />
      </a-row>
    </a-col>
    <a-col :sm="24" :lg="12" :xl="12">
      <a-row>
        <UserBookingList />
      </a-row>
    </a-col>
  </a-row>
</template>

<script setup>
import BookingSchedule from './components/BookingSchedule.vue'
import UserBookingList from './components/UserBookingList.vue'
</script>

<template>
  <a-card size="small" :hoverable="true" class="report-card">
    <span class="large bold">Graphic Bookings By Rooms</span>
    <BarChart
      height="545px"
      title="Booking"
      :x-axis-data="reportStore.formattedRoomSummary[0]"
      :y-axis-data="reportStore.formattedRoomSummary[1]"
    />
  </a-card>
</template>

<script setup>
import BarChart from '@/components/BarChart.vue'
import { useReportStore } from '@/stores/report'
const reportStore = useReportStore()
</script>

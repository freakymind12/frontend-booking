<template>
  <a-col :sm="24" :lg="24" :xl="24">
    <a-card size="small">
      <a-flex justify="space-between" gap="small" wrap="wrap">
        <span class="large bold">Year Month</span>
        <a-date-picker
          picker="month"
          v-model:value="yearmonth"
          class="month-picker"
          :allowClear="false"
        />
      </a-flex>
    </a-card>
  </a-col>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import dayjs from 'dayjs'
import { useReportStore } from '@/stores/report'

const reportStore = useReportStore()
const yearmonth = ref(dayjs())

watchEffect(async () => {
  await reportStore.get({
    yearmonth: yearmonth.value.format('YYYY-MM'),
  })
})
</script>

<style scoped>
.month-picker {
  width: 120px;
}
</style>

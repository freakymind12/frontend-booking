<template>
  <a-card size="small" :hoverable="true" class="report-card">
    <span class="large bold">Graphic Bookings By Department</span>
    <BarChart
      height="300px"
      title="Booking"
      :x-axis-data="reportStore.formattedBookingDept[0]"
      :y-axis-data="reportStore.formattedBookingDept[1]"
    />
    <span class="large bold">Top 3 Users by Total Meeting Duration</span>
    <MasterTable
      size="small"
      :scroll-y="300"
      :columns="columns"
      :data="reportStore.reports?.topUsers"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'username'">
          {{ capitalizeEachWord(record.username) }}
        </template>
        <template v-if="column.key === 'total_minutes'">
          {{ Number(record.total_minutes).toLocaleString('id-ID') }}
        </template>
      </template>
    </MasterTable>
  </a-card>
</template>

<script setup>
import { useReportStore } from '@/stores/report'
import BarChart from '@/components/BarChart.vue'
import MasterTable from '@/components/MasterTable.vue'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
const reportStore = useReportStore()

const columns = [
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
    sorter: (a, b) => a.username.localeCompare(b.username),
  },
  {
    title: 'Dept',
    dataIndex: 'dept',
    key: 'dept',
    sorter: (a, b) => a.dept.localeCompare(b.dept),
  },
  {
    title: 'Duration (Minutes)',
    dataIndex: 'total_minutes',
    key: 'total_minutes',
    sorter: (a, b) => a.total_minutes - b.total_minutes,
  },
]
</script>

<style scoped>
.report-card {
  height: 600px;
}
</style>

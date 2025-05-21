<template>
  <a-card size="small" class="room-schedule">
    <a-space direction="vertical" :size="10">
      <a-flex justify="center" align="center">
        <span class="x-large bold"> <CalendarOutlined /> Today's Schedule </span>
      </a-flex>
      <a-flex vertical gap="small" class="list-schedule" v-if="bookings.length > 0">
        <a-card
          size="small"
          v-for="(data, index) in bookings"
          :key="index"
          :hoverable="true"
          class="card-schedule"
        >
          <a-flex vertical :gap="2">
            <a-flex justify="space-between" align="center">
              <span class="bold"><UserOutlined /> {{ capitalizeEachWord(data.username) }} </span>
              <span class="bold"><UsergroupAddOutlined /> {{ data.dept }}</span>
            </a-flex>
            <span><ReconciliationOutlined /> {{ capitalizeEachWord(data.meeting_name) }}</span>
            <a-flex justify="space-between" align="center">
              <span
                ><ClockCircleOutlined /> {{ data.start.split(' ')[1].slice(0, 5) }} -
                {{ data.end.split(' ')[1].slice(0, 5) }}
              </span>
              <a-tag :color="data.status === 'Cancel' ? '#F75A5A' : '#018000'" v-if="data.status">{{
                data.status
              }}</a-tag>
            </a-flex>
          </a-flex>
        </a-card>
      </a-flex>
      <a-flex v-else class="empty-container" justify="center" align="center">
        <a-empty class="empty" description="There is no schedule today" />
      </a-flex>
    </a-space>
  </a-card>
</template>

<script setup>
import {
  CalendarOutlined,
  UserOutlined,
  ReconciliationOutlined,
  ClockCircleOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons-vue'
import { useBookingStore } from '@/stores/bookings'
import { storeToRefs } from 'pinia'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'

const bookingStore = useBookingStore()
const { bookings } = storeToRefs(bookingStore)
</script>

<style scoped>
.room-schedule {
  height: 600px;
  border: 4px solid #264d8e;
}

.list-schedule {
  height: 520px;
  overflow-y: auto;
  padding-right: 10px;
  padding-bottom: 8px;
  padding-top: 8px;
}

.card-schedule {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  width: 300px;
}

.empty-container {
  height: 415px;
}

.empty {
  width: 300px;
}
</style>

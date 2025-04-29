<template>
  <div class="features">
    <a-row :gutter="[16,16]">
      <a-col span="24">
        <a-card>
          <h2 class="header-card"><ClockCircleTwoTone /> Realtime Queue Management</h2>
          <p>Manage your room queues in realtime.</p>
        </a-card>
      </a-col>
      <a-col span="24">
        <a-card>
          <h2><CheckCircleTwoTone /> Easy Room Booking</h2>
          <p>Book rooms quickly and easily.</p>
        </a-card>
      </a-col>
      <a-col span="24">
        <a-card>
          <h2><FundTwoTone /> Analytics & Reports</h2>
          <p>Detailed analytics and reports on room usage.</p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ClockCircleTwoTone, CheckCircleTwoTone, FundTwoTone } from '@ant-design/icons-vue'
</script>

<style scoped>
.features {
  height: 600px;
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.features .ant-card {
  text-align: center;
  margin-bottom: 1rem;
  border: solid #264d8e 1px;
}

.features .ant-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transform: scale(1.02);
}

.header {
  font-size: 1em;
}

.features p {
  font-size: 1rem;
}
</style>

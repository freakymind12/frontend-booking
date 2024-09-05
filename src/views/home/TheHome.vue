<template>
  <div class="banner">
    <h1>Welcome to Room Booking Queue System</h1>
    <p>Efficiently manage your room bookings with our real-time queue system.</p>
  </div>
  <div class="features">
    <a-row gutter="16">
      <a-col span="8">
        <a-card title="Real-time Queue Management" bordered>
          <p>Manage your room queues in real-time.</p>
        </a-card>
      </a-col>
      <a-col span="8">
        <a-card title="Easy Room Booking" bordered>
          <p>Book rooms quickly and easily with our intuitive interface.</p>
        </a-card>
      </a-col>
      <a-col span="8">
        <a-card title="Analytics & Reports" bordered>
          <p>View detailed analytics and reports on room usage.</p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup></script>

<style scoped>
.banner {
  margin-bottom: 20px;
  text-align: center;
}

.banner h1 {
  font-size: 2.5rem;
}
.banner p {
  font-size: 1rem;
}

.features {
  padding: 50px;
}

.features .ant-card {
  text-align: center;
}
</style>

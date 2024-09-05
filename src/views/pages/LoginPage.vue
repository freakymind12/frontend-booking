<template>
  <a-col :span="5">
    <a-card class="booking-card">
      <h2>Fill this form to booking</h2>
      <a-form layout="vertical" :model="form" @finish="handleBooking">
        <a-form-item label="Room" name="id_room" :rules="[{ required: true }]">
          <a-input placeholder="Room" v-model:value="form.id_room" />
        </a-form-item>
        <a-form-item label="Meeting Name" name="meeting_name" :rules="[{ required: true }]">
          <a-input placeholder="Meeting Name" v-model:value="form.meeting_name" />
        </a-form-item>
        <a-form-item label="Start & End Time" name="time" :rules="[{ required: true }]">
          <a-range-picker
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :placeholder="['Start Time', 'End Time']"
            @change="onRangeChange"
            v-model:value="form.time"
          />
        </a-form-item>
        <a-form-item>
          <a-space size="large">
            <a-button
              @click="handleReset"
              :disabled="form.id_room === '' || form.meeting_name === '' || form.time.length === 0"
              >Reset</a-button
            >
            <a-button
              type="primary"
              html-type="submit"
              :disabled="form.id_room === '' || form.meeting_name === '' || form.time.length === 0"
            >
              Submit
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </a-col>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  meeting_name: '',
  id_room: '',
  time: [null, null] // Inisialisasi sebagai array
})

const onRangeChange = (value, dateString) => {
  // dateString seharusnya berupa array dua elemen: start dan end
  form.value.time = dateString // Update form.time dengan dateString
  console.log('Selected Time: ', value)
  console.log('Formatted Selected Time: ', dateString)
}

const handleBooking = () => {
  console.log(form.value)
}

const handleReset = () => {
  form.value = {
    meeting_name: '',
    id_room: '',
    time: [null, null] // Reset time menjadi array kosong
  }
}
</script>

<style scoped>
.booking-card {
  height: 600px; /* Tetapkan tinggi tetap */
  overflow-y: auto; /* Tambahkan scroll secara vertikal */
  padding-right: 8px;
}

.booking-card::-webkit-scrollbar {
  display: none; /* Menyembunyikan scrollbar */
}
</style>

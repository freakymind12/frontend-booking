<template>
  <a-row :gutter="[8, 8]" :wrap="true">
    <a-col :sm="24" :lg="12" :xl="12">
      <a-row>
        <MasterRoom />
      </a-row>
    </a-col>
    <a-col :sm="24" :lg="12" :xl="12">
      <a-row>
        <AccountControl />
      </a-row>
    </a-col>
    <a-col :sm="24" :lg="24" :xl="24">
      <a-row>
        <AutoSchedule />
      </a-row>
    </a-col>
  </a-row>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoomStore } from '@/stores/room'
import MasterRoom from './components/MasterRoom.vue'
import AccountControl from './components/AccountControl.vue'
import AutoSchedule from './components/AutoSchedule.vue'

const roomStore = useRoomStore()

onMounted(async () => {
  await roomStore.get()
})
</script>

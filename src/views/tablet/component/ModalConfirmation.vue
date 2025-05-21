<template>
  <a-flex vertical :gap="10">
    <span class="large">Are you sure want to confirm <span class="bold" :class="mode == 'Present' ? 'green' : 'red'">{{
      mode
        }}</span> this booking ? </span>
    <a-card size="small" class="card-booking" :hoverable="true">
      <a-space direction="vertical" :size="2">
        <span class="medium"><user-outlined /> {{ capitalizeEachWord(data.username) }}</span>
        <span class="medium"><reconciliation-outlined /> {{ capitalizeEachWord(data.meeting_name) }}</span>
        <span class="medium"><clock-circle-outlined /> {{ data.start.split(" ")[1].slice(0, 5) }} - {{ data.end.split(" ")[1].slice(0,5) }} </span>
      </a-space>
    </a-card>
    <a-flex justify="flex-end" gap="small">
      <a-button @click="emit('close')">Close</a-button>
      <a-button type="primary" @click="handleSubmit">Submit</a-button>
    </a-flex>
  </a-flex>

</template>

<script setup>
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import {
  UserOutlined,
  ClockCircleOutlined,
  ReconciliationOutlined,
} from '@ant-design/icons-vue'
const emit = defineEmits(['cancel', 'present', 'close'])

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  mode: {
    type: String,
    default: null
  }
})

const handleSubmit = () => {
  if (props.mode == 'Present') {
    emit('present')
  }
  if (props.mode == 'Cancel') {
    emit('cancel')
  }

  emit('close')
}
</script>

<style scoped>
.italic {
  font-style: italic;
}

.green {
  font-style: italic;
  color: rgba(8, 128, 8, 0.829);
}

.red {
  font-style: italic;
  color: rgba(211, 13, 13, 0.815)
}

.card-booking {
  border: 2px solid #264D8E;
  margin-bottom: 1rem;
}

.card-booking:hover {
  background-color: #d6d6d61f;
}

.medium {
  font-size: 16px;
}
</style>
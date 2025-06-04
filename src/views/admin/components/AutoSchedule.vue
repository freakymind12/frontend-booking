<template>
  <BaseCardColumn title="Auto Schedule" :xs="24" :xl="24" :lg="24" :sm="24" :md="24">
    <template #body>
      <a-row :gutter="[8, 8]" :wrap="true">
        <a-col :sm="24" :md="12" :lg="12" :xl="8" v-for="day in daysOfWeek" :key="day">
          <a-card size="small" class="card-day">
            <a-flex justify="space-between" class="mb">
              <span class="bold large">{{ day }}</span>
              <a-button type="primary" size="small" @click="handleAdd({ day })">Add </a-button>
            </a-flex>
            <a-flex vertical gap="small" class="wrapper-schedule-card">
              <a-dropdown
                :trigger="['click']"
                v-for="(schedule, index) in autoScheduleStore.getSchedulesByDay(day)"
                :key="index"
                arrow
              >
                <a-card size="small" :hoverable="true">
                  <a-flex vertical :gap="2">
                    <a-flex justify="space-between">
                      <span class="bold"><UserOutlined /> {{ capitalizeEachWord(schedule.username) }}</span>
                      <a-space :size="0">
                        <a-tag class="bold"
                          ><ClockCircleOutlined /> {{ schedule.start.slice(0, 5) }} -
                          {{ schedule.end.slice(0, 5) }}</a-tag
                        >
                        <a-tag class="bold"><UsergroupAddOutlined /> {{ schedule.dept }}</a-tag>
                      </a-space>
                    </a-flex>
                    <span><HomeOutlined /> {{ schedule.room_name }}</span>
                    <span><ReconciliationOutlined /> {{ capitalizeEachWord(schedule.meeting_name) }}</span>
                  </a-flex>
                </a-card>
                <template #overlay>
                  <a-menu class="menu-dropdown">
                    <a-menu-item @click="handleEdit(schedule)">Edit</a-menu-item>
                    <a-menu-item @click="handleDelete(schedule)">Delete</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-flex>
            <a-flex
              justify="center"
              align="center"
              class="wrapper-schedule-card"
              v-if="!autoScheduleStore.getSchedulesByDay(day).length"
            >
              <a-empty description="No schedule" />
            </a-flex>
          </a-card>
        </a-col>
      </a-row>
    </template>
  </BaseCardColumn>

  <Teleport to="body">
    <BaseModal :visible="modalData.visible" :modal-title="modalData.title" @close="handleClose">
      <template #body>
        <FormAutoSchedule :data="modalData.data" :mode="modalData.mode" @close="handleClose" />
      </template>
    </BaseModal>
  </Teleport>
</template>

<script setup>
import { useAutoScheduleStore } from '@/stores/autoSchedule'
import BaseCardColumn from '@/components/BaseCardColumn.vue'
import BaseModal from '@/components/BaseModal.vue'
import FormAutoSchedule from './FormAutoSchedule.vue'
import {
  UsergroupAddOutlined,
  ReconciliationOutlined,
  ClockCircleOutlined,
  UserOutlined,
  HomeOutlined,
} from '@ant-design/icons-vue'
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'

const autoScheduleStore = useAutoScheduleStore()

const daysOfWeek = Array.from({ length: 6 }, (_, i) => {
  const dayValue = (i + 1) % 7
  return dayjs().day(dayValue).format('dddd')
})

const modalData = ref({
  visible: false,
  mode: null,
  data: null,
  title: '',
})

const openModal = ({ title, data = null, mode }) => {
  modalData.value = {
    visible: true,
    title,
    data,
    mode,
  }
}

const handleEdit = (item) => {
  openModal({ title: 'Edit Auto Schedule', data: item, mode: 'edit' })
}

const handleAdd = (item) => {
  openModal({ title: 'Add Auto Schedule', mode: 'add', data: item })
}

const handleDelete = (item) => {
  openModal({ title: 'Delete Auto Schedule', data: item, mode: 'delete' })
}

const handleClose = (isVisible) => {
  modalData.value.visible = isVisible
}

onMounted(() => {
  autoScheduleStore.get()
})
</script>

<style scoped>
.mb {
  margin-bottom: 8px;
}

.card-day {
  max-width: 100%;
  height: 300px;
}

.wrapper-schedule-card {
  height: 240px;
  overflow-y: auto;
  padding: 5px;
}

.menu-dropdown {
  width: fit-content;
}
</style>

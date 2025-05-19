<template>
  <BaseCardColumn title="Master Room" :xs="24" :xl="24" :lg="24" :sm="24" :md="24">
    <template #body>
      <a-flex justify="space-between" align="center" class="mb">
        <a-input class="search-input" placeholder="Room Name" v-model:value="searchInput">
          <template #prefix>
            <span class="bold">
              <SearchOutlined />
            </span>
          </template>
        </a-input>
        <a-button type="primary" @click="handleAdd">New Room</a-button>
      </a-flex>
      <a-flex vertical :gap="5" class="wrapper-card-list" v-if="filteredRooms.length > 0">
        <a-card size="small" :hoverable="true" v-for="(room, index) in filteredRooms" :key="index">
          <a-flex vertical gap="small">
            <a-flex justify="space-between" align="center">
              <span class="bold large">{{ room.room_name }}</span>
              <a-space :size="3">
                <a-button type="primary" size="small" @click="handleEdit(room)"> Edit </a-button>
                <a-button type="primary" danger size="small" @click="handleDelete(room)">
                  Delete
                </a-button>
              </a-space>
            </a-flex>
            <a-space direction="vertical" :size="0">
              <span>
                <UsergroupAddOutlined /> {{ room.capacity.toLocaleString('id-ID') }} Persons
              </span>
              <span> <InfoCircleOutlined /> {{ room.description }} </span>
            </a-space>
          </a-flex>
        </a-card>
      </a-flex>
      <a-flex justify="center" align="center" class="wrapper-card-list" v-else>
        <a-empty description="No Room Data" />
      </a-flex>
    </template>
  </BaseCardColumn>

  <!-- Modal -->
  <Teleport to="body">
    <BaseModal :visible="modalData.visible" :modal-title="modalData.title" @close="handleClose">
      <template #body>
        <FormRoom :data="modalData.data" :mode="modalData.mode" @close="handleClose" />
      </template>
    </BaseModal>
  </Teleport>
</template>

<script setup>
import { useRoomStore } from '@/stores/room'
import BaseCardColumn from '@/components/BaseCardColumn.vue'
import { computed, ref } from 'vue'
import { UsergroupAddOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons-vue'
import BaseModal from '@/components/BaseModal.vue'
import FormRoom from './FormRoom.vue'

const searchInput = ref(null)
const roomStore = useRoomStore()
const modalData = ref({
  visible: false,
  mode: null,
  data: null,
  title: '',
})

const filteredRooms = computed(() => roomStore.getRoomsByName(searchInput.value))

const openModal = ({ title, data = null, mode }) => {
  modalData.value = {
    visible: true,
    title,
    data,
    mode,
  }
}

const handleEdit = (item) => {
  openModal({ title: 'Edit Room', data: item, mode: 'edit' })
}

const handleAdd = () => {
  openModal({ title: 'Add Room', mode: 'add' })
}

const handleDelete = (item) => {
  openModal({ title: 'Delete Room', data: item, mode: 'delete' })
}

const handleClose = (isVisible) => {
  modalData.value.visible = isVisible
}
</script>

<style scoped>
.wrapper-card-list {
  padding: 5px 8px;
  max-height: 500px;
  overflow-y: auto;
}

.search-input {
  width: 200px;
}
</style>

<template>
  <a-col :span="10">
    <a-row gutter="24" class="scrollable-column">
      <a-col :span="24" v-if="rooms.length === 0">
        <a-card class="empty-card">
          <a-empty description="No Room Data" />
        </a-card>
      </a-col>
      <a-col :span="24" v-for="room in rooms" :key="room.id" style="margin-bottom: 1px">
        <a-card class="room-card">
          <a-space :size="15">
            <h2>{{ room.room_name }}</h2>
            <a-tooltip>
              <template #title> Edit</template>
              <EditOutlined @click="handleEdit(room)" class="edit-icon" />
            </a-tooltip>
            <a-popconfirm
              title="Are you sure delete this room?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="handleDelete(room.id_room)"
            >
              <a-tooltip>
                <template #title> Delete</template>
                <DeleteOutlined class="delete-icon" />
              </a-tooltip>
            </a-popconfirm>
          </a-space>
          <p><UserOutlined /> {{ room.capacity.toLocaleString() }} persons</p>
          <p style="margin-bottom: 4px"><BankOutlined /> {{ room.description }}</p>
        </a-card>
      </a-col>
    </a-row>
  </a-col>
  <ModalForm :visible="modalVisible" @close="handleClose" :room="selectedRoom" @edit="fetchRoom" />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { UserOutlined, BankOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import axios from 'axios'
import ModalForm from './ModalForm.vue'
import { message } from 'ant-design-vue'

const rooms = ref([])
const modalVisible = ref(false)
const selectedRoom = ref(null)

const props = defineProps({
  refreshKey: Number
})

const handleEdit = (room) => {
  modalVisible.value = true
  selectedRoom.value = room
}

const handleClose = () => {
  modalVisible.value = false
}

const fetchRoom = async () => {
  try {
    const response = await axios.get('http://192.168.148.201:5151/rooms')
    rooms.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = async (id) => {
  try {
    await axios.delete(`http://192.168.148.201:5151/rooms/${id}`)
    fetchRoom()
    message.info('Success delete room')
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => props.refreshKey,
  () => {
    fetchRoom()
  }
)

onMounted(() => {
  fetchRoom()
})
</script>

<style scoped>
.room-card {
  padding: 24px;
  background-color: #ffffff;
  margin-bottom: 1rem;
  border: solid #264d8e 1px;
}

.room-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transform: scale(1.02);
}

.room-card p {
  margin: 0;
}

.scrollable-column {
  height: 600px;
  overflow: auto; /* Mengizinkan scroll */
  scrollbar-width: none; /* Firefox */
}

/* Untuk WebKit (Chrome, Safari) */
.scrollable-column::-webkit-scrollbar {
  display: none; /* Menyembunyikan scrollbar */
}

.empty-card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* Sesuaikan height card dengan parent */
  min-height: 600px; /* Sama dengan tinggi scrollable-column */
  border: 1px solid #264d8e;
}

.edit-icon {
  color: black;
  font-size: large;
}

.edit-icon:hover {
  color: #2db7f5;
}

.delete-icon {
  color: #000;
  font-size: large;
}

.delete-icon:hover {
  color: red;
}
</style>

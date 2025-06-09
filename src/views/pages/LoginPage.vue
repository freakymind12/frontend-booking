<template>
  <a-flex justify="center" align="center" class="register-container">
    <a-card class="register-card">
      <a-flex justify="flex-end">
        <TranslateGoogle />
      </a-flex>
      <a-flex justify="center" align="center" gap="small" vertical>
        <a-flex justify="center" align="center" gap="large" class="logo-img">
          <a-image :src="hrs" :width="100" :preview="false" />
          <h2 :class="{ 'logo-name': true, 'intro-active': isActive }">
            Meeting Room<br />
            Management
          </h2>
        </a-flex>
        <p style="font-size: 1rem; color: gray; margin-bottom: 0px">Login with your account</p>
      </a-flex>
      <a-form :model="form" @finish="auth.login(form.email, form.password)" layout="vertical">
        <a-form-item
          label="Email"
          name="email"
          :rules="[{ required: true, message: 'Please input your email!' }]"
        >
          <a-input v-model:value="form.email" placeholder="Email" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="form.password" placeholder="Password" />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            block
            :disabled="form.email === '' || form.password === ''"
          >
            Login
          </a-button>
        </a-form-item>
      </a-form>
      <a-flex justify="center" align="center" :gap="10">
        <a-tooltip title="Register">

        <UserAddOutlined @click="router.push('/register')" class="bold large icon-login" />
        </a-tooltip>
        <a-tooltip title="Tablet Queue">
        <TabletOutlined @click="toQueue" class="bold large icon-login"/>
        </a-tooltip>
        <a-tooltip title="Forgot Password">
          <LockOutlined @click="router.push('/forgot-password')" class="bold large icon-login" />
        </a-tooltip>
        <a-tooltip title="User Guide">
          <QuestionCircleOutlined @click="openModal({ title: 'User Guide', data: null, mode: null })"
            class="bold large icon-login" />
        </a-tooltip>
      </a-flex>
    </a-card>
  </a-flex>
  <Teleport to="body">
    <BaseModal width="1200px" :visible="modalData.visible" :modal-title="modalData.title" @close="handleClose">
      <template #body>
        <iframe src="/user-guide.pdf" width="100%" height="650px" title="User Guide" />
      </template>
    </BaseModal>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import hrs from '@/assets/images/hrs.png'
import TranslateGoogle from '@/components/TranslateGoogle.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useRoomStore } from '@/stores/room'
import { TabletOutlined, UserAddOutlined, LockOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import BaseModal from '@/components/BaseModal.vue'

const roomStore = useRoomStore()
const router = useRouter()
const auth = useAuthStore()
const form = ref({
  email: '',
  password: '',
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

const handleClose = (isVisible) => {
  modalData.value.visible = isVisible
}

// Variable untuk mengatur status animasi
const isActive = ref(false)

const toQueue = async () => {
  await roomStore.get()
  router.push(`/queue/${roomStore.rooms[0].id_room}`)
}



onMounted(() => {
  // Set `isActive` menjadi true setelah mount untuk memicu animasi
  setTimeout(() => {
    isActive.value = true
  }, 100)
})

onUnmounted(() => {
  isActive.value = false
})
</script>

<style scoped>
.register-container {
  height: 100dvh;
  background: #f0f2f5;
}

.register-card {
  padding: 5px;
  border-radius: 8px;
  width: 30%;
}

.register-card .ant-card-body {
  padding: 0;
}

.a-button {
  width: 100%;
}

.ant-link {
  color: grey;
  text-decoration: none;
  font-weight: 600;
}
.ant-link:hover {
  text-decoration: underline; /* Underline on hover */
}

.logo-name {
  margin-bottom: 0px;
  font-family: monospace;
  font-weight: 600;
  opacity: 0; /* Start with hidden */
  transform: scale(0.8); /* Mulai dengan ukuran lebih kecil */
  transition:
    opacity 0.8s ease-out,
    transform 0.8s ease-out;
}

.logo-name.intro-active {
  opacity: 1; /* Setelah kelas ditambahkan, elemen terlihat */
  transform: scale(1); /* Kembali ke ukuran normal */
}

.logo-img:hover {
  cursor: pointer;
}

.icon-login {
  border-radius: 50%;
  padding: 10px;
  background-color: #f0f2f5;
}

.icon-login:hover {
  background-color: #e6e6e6;
}
</style>

<template>
  <a-flex justify="center" align="center" class="register-container">
    <a-card class="register-card">
      <a-flex justify="center" align="center" gap="small" vertical>
        <a-flex justify="center" align="center" gap="large" class="logo-img">
          <a-image :src="hrs" :width="100" :preview="false" @click="toQueue" />
          <h2 :class="{ 'logo-name': true, 'intro-active': isActive }">
            Meeting Room<br />
            Management
          </h2>
        </a-flex>
        <p style="font-size: 1rem; color: gray; margin-bottom: 0px">Login to your account</p>
      </a-flex>
      <a-form :model="form" @finish="handleLogin" layout="vertical">
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
      <p align="center" style="color: gray">
        Don't have an account?
        <router-link to="/register" class="ant-link"> Sign up</router-link>
      </p>
    </a-card>
  </a-flex>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Cookies from 'js-cookie'
import { message } from 'ant-design-vue'
import hrs from '@/assets/hrs.png'

const form = ref({
  email: '',
  password: ''
})
const errorMessage = ref('')

// Variable untuk mengatur status animasi
const isActive = ref(false)

const router = useRouter()

onMounted(() => {
  // Set `isActive` menjadi true setelah mount untuk memicu animasi
  setTimeout(() => {
    isActive.value = true
  }, 100)
})

const handleLogin = async () => {
  try {
    const response = await axios.post('http://192.168.148.201:5151/auth/login', {
      email: form.value.email,
      password: form.value.password
    })
    Cookies.set('jwt_token', response.data.token, { expires: 24, sameSite: 'lax' })
    router.push('/')
  } catch (error) {
    errorMessage.value = error.response.data.message || 'An error occurred during login.'
    info()
    console.error(error)
  }
}

const info = () => {
  message.error(errorMessage.value)
}

const toQueue = async () => {
  let idroom
  try {
    const response = await axios.get('http://192.168.148.201:5151/rooms')
    if (response.data.data.length > 0) {
      idroom = response.data.data[0].id_room
      router.push(`/queue/${idroom}`)
    } else {
      router.push('/error')
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
.register-container {
  height: 100vh;
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
  color: #000000;
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
</style>

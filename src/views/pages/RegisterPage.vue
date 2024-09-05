<template>
  <a-row justify="center" align="middle" class="register-container">
    <a-col :span="8">
      <a-card class="register-card">
        <h2>Register an account</h2>
        <a-form :model="form" @finish="handleRegister" layout="vertical">
          <a-form-item
            label="Username"
            name="username"
            :rules="[{ required: true, message: 'Please input your username!' }]"
          >
            <a-input v-model:value="form.username" placeholder="Username" />
          </a-form-item>

          <a-form-item
            label="Email"
            name="email"
            :rules="[{ required: true, message: 'Please input your email!' }]"
          >
            <a-input v-model:value="form.email" placeholder="Email" />
          </a-form-item>

          <a-form-item
            label="Department"
            name="dept"
            :rules="[{ required: true, message: 'Please select your department' }]"
          >
            <a-select v-model:value="form.dept" placeholder="Department">
              <a-select-option value="PE">PE</a-select-option>
              <a-select-option value="PM">PM</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            label="Password"
            name="password"
            :rules="[{ required: true, message: 'Please input your password!' }]"
          >
            <a-input-password v-model:value="form.password" placeholder="Password" />
          </a-form-item>

          <a-form-item
            label="Re-type Password"
            name="retype_password"
            :rules="[{ required: true, message: 'Please retype your password!' }]"
          >
            <a-input-password v-model:value="form.retype_password" placeholder="Password" />
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              block
              :disabled="
                form.email === '' ||
                form.password === '' ||
                form.retype_password === '' ||
                form.dept === ''
              "
            >
              Login
            </a-button>
          </a-form-item>
        </a-form>
        <p>
          Login on homepage if you already have an account
          <router-link to="/" class="ant-link"> here</router-link>
        </p>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const form = ref({
  username: '',
  email: '',
  password: '',
  dept: '',
  retype_password: ''
})
const errorMessage = ref('')

const router = useRouter()

const handleRegister = async () => {
  try {
    if (form.value.password !== form.value.retype_password) {
      errorMessage.value = 'password and retype password do not match'
      return
    }
    const response = await axios.post('http://localhost:5151/users/signup', {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      dept: form.value.dept
    })
    console.log(response)
    router.push('/login')
  } catch (error) {
    console.error('Register failed:', error)
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
}

.register-card .ant-card-body {
  padding: 0;
}

.a-button {
  width: 100%;
}

.ant-link {
  color: #1890ff; /* Ant Design default link color */
  text-decoration: none; /* Remove underline */
}
.ant-link:hover {
  text-decoration: underline; /* Underline on hover */
}
</style>

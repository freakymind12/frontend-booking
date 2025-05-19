<template>
  <a-flex justify="center" align="center" class="container">
    <a-card size="small" class="forgot-password-card" :hoverable="true">
      <a-flex justify="flex-start" :gap="5" vertical class="mb">
        <span class="x-large bold"> Recover Your Account </span>
        <span class="large"> Enter your email and we'll send you a link to get back into your account. </span>
      </a-flex>
      <a-form layout="vertical" :model="formState" @finish="handleAction" >
        <a-form-item
          name="email"
          :rules="[
            { required: true, message: 'Please input your email', trigger: 'change' },
            { type: 'email', message: 'Please enter a valid email', trigger: ['blur', 'change'] },
          ]"
        >
          <a-input v-model:value="formState.email" placeholder="example@mail.com" />
        </a-form-item>

        <a-alert
          show-icon
          :message="message"
          class="mb"
          :type="alertCode != 200 ? 'error' : 'success'"
          v-if="alertCode"
        />

        <a-flex justify="flex-end" gap="small">
          <a-button class="text" @click="router.push('login')"><LeftCircleOutlined/> Back to login</a-button>
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-flex>
      </a-form>
    </a-card>
  </a-flex>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { LeftCircleOutlined } from '@ant-design/icons-vue';

const router = useRouter()

const authStore = useAuthStore()
const message = ref()
const alertCode = ref(false)
const formState = ref({
  email: null,
})

const handleAction = async () => {
  const response = await authStore.forgotPassword(formState.value)

  if (response.code == 200) {
    message.value = `Success sent email for recover your password, check your email or spam folder`
  } else {
    message.value = response.message
  }

  alertCode.value = response.code
}
</script>

<style scoped>
.container {
  height: 100dvh;
  background-color: rgba(209, 209, 209, 0.267);
}

.forgot-password-card {
  max-width: 40%;
  min-width: 300px;
}

.mb {
  margin-bottom: 8px;
}

.text {
  background-color:gray;
  border: 0px;
}

.text:hover {
  background-color: rgb(165, 165, 165);
  color: black;
  border: 0px;
}
</style>

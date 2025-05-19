<template>
  <a-flex justify="center" align="center" class="container">
    <a-card size="small" class="recovery-password-card" :hoverable="true">
      <a-flex vertical class="mb" :gap="10">
        <span class="x-large bold">Password Recovery</span>
        <span class="large"> Make sure you remember the password you used.</span>
      </a-flex>
      <a-form layout="vertical" :model="formState" @finish="handleAction" :hideRequiredMark="true">
        <a-form-item
          label="New Password"
          name="password"
          :rules="[
            { required: true, message: 'Please input your new password', trigger: 'change' },
          ]"
        >
          <a-input-password v-model:value="formState.password" placeholder="*********" />
        </a-form-item>
        <a-form-item
          label="Repeat Password"
          name="repeat_password"
          :rules="[
            { required: true, message: 'Please repeat your new password', trigger: 'change' },
            { validator: validateRepeatPassword, trigger: 'change' },
          ]"
        >
          <a-input-password v-model:value="formState.repeat_password" placeholder="*********" />
        </a-form-item>

        <a-flex justify="flex-end" gap="small">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-flex>
      </a-form>
    </a-card>
  </a-flex>
</template>

<script setup>
import { h, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'
import { notification } from 'ant-design-vue'
import { LoadingOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()
const iv = route.query.iv
const data = route.query.data

const formState = ref({
  password: null,
  repeat_password: null,
})

const validateRepeatPassword = async (_rule, value) => {
  if (value !== formState.value.password) {
    return Promise.reject('Repeat password do not match with password')
  }
  return Promise.resolve()
}

const handleAction = async () => {
  const response = await authStore.recoveryPassword({
    iv,
    data,
    password: formState.value.password,
  })
  if (response.code == 200) {
    notification.open({
      message: `Success renew your password`,
      description: `Wait a seconds it won't take long to direct you to the login page`,
      placement: 'topRight',
      duration: 3.5,
      icon: h(LoadingOutlined, {
        style: 'color: #108ee9',
      }),
    })
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  }

}
</script>

<style scoped>
.container {
  height: 100dvh;
  background-color: rgba(209, 209, 209, 0.267);
}

.recovery-password-card {
  max-width: 40%;
  min-width: 400px;
}

.mb {
  margin-bottom: 8px;
}
</style>

<template>
  <a-layout-header class="header">
    <div class="logo">
      <img src="@/assets/hrs.png" alt="Logo HRS" />
    </div>
    <a-menu mode="horizontal" class="menu">
      <a-menu-item key="home" class="large-menu-item">
        <RouterLink to="/">Home</RouterLink>
      </a-menu-item>
      <a-menu-item key="booking" class="large-menu-item">
        <RouterLink to="/booking">Booking</RouterLink>
      </a-menu-item>
      <a-menu-item key="admin" v-if="user.role == 'admin' || user.role == 'staff'">
        <RouterLink to="/admin">Admin</RouterLink>
      </a-menu-item>
      <a-menu-item key="control" v-if="user.role == 'admin'">
        <RouterLink to="/control">Control</RouterLink>
      </a-menu-item>
      <a-dropdown>
        <a-menu-item>
          <a-dropdown>
            <a> <UserOutlined /> {{ user.name }} <a-icon type="down" /> </a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="logout" @click="logout">Logout</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-menu-item>
      </a-dropdown>
    </a-menu>
  </a-layout-header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import auth from '@/auth/auth'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref('')

const getUserData = async () => {
  try {
    user.value = await auth.checkRoles()
  } catch (error) {
    console.error(error)
  }
}

const logout = () => {
  Cookies.remove('jwt_token')
  router.push('/login')
}

onMounted(() => {
  getUserData()
})
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  padding: 0 24px;
}

.logo img {
  height: 30px;
}

.logo {
  flex-shrink: 0;
}

.menu {
  flex: 1;
  align-items: center;
  padding-left: 2em;
}

.ant-menu-title-content a {
  font-size: 16px;
  font-family: sans-serif;
}
</style>

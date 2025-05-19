<template>
  <BaseCardColumn title="Account Control" :xs="24" :xl="24" :lg="24" :sm="24" :md="24">
    <template #body>
      <!-- User Count & Selector Department -->
      <a-flex justify="space-between" align="center" class="mb">
        <a-space size="small">
          <a-card size="small" v-for="(user, index) in userStore.totalUsers" :key="index">
            <a-space direction="vertical" :size="0">
              <span class="bold">{{ capitalizeEachWord(user.roles) }}</span>
              <span><UserOutlined /> {{ user.total_users }} Person</span>
            </a-space>
          </a-card>
        </a-space>
        <a-space direction="vertical" :size="0">
          <span class="bold">Department</span>
          <a-select size="small" v-model:value="selectedDept" class="select-option">
            <a-select-option value="ALL">ALL</a-select-option>
            <a-select-option value="PE">PE</a-select-option>
            <a-select-option value="PM">PM</a-select-option>
            <a-select-option value="AL">AL</a-select-option>
            <a-select-option value="PGA">PGA</a-select-option>
            <a-select-option value="FIN">FIN</a-select-option>
            <a-select-option value="PUR">PUR</a-select-option>
            <a-select-option value="KAI">KAI</a-select-option>
            <a-select-option value="PC">PC</a-select-option>
            <a-select-option value="QC">QC</a-select-option>
          </a-select>
        </a-space>
      </a-flex>
      <!-- User List -->
      <a-flex vertical gap="small" class="wrapper-card-list">
        <a-card size="small" :hoverable="true" v-for="(user, index) in filteredUsers" :key="index">
          <a-flex vertical :gap="1">
            <span class="bold"><UserOutlined /> {{ capitalizeEachWord(user.username) }}</span>
            <a-flex justify="space-between" align="center">
              <span><MailOutlined /> {{ user.email }}</span>
              <a-space :size="0">
                <a-tag class="bold"> <UsergroupAddOutlined /> {{ user.dept }} </a-tag>
                <a-tag class="bold" :color="user.roles === 'admin' ? '#018000' : user.roles === 'viewer' ? 'grey' : '#F0A04B'">{{
                  capitalizeEachWord(user.roles)
                }}</a-tag>
              </a-space>
            </a-flex>
          </a-flex>
        </a-card>
        <a-empty v-if="filteredUsers.length === 0" description="No user found" />
      </a-flex>
    </template>
  </BaseCardColumn>
</template>

<script setup>
import BaseCardColumn from '@/components/BaseCardColumn.vue'
import { useUserStore } from '@/stores/users'
import { computed, onMounted, ref } from 'vue'
import { UsergroupAddOutlined, UserOutlined, MailOutlined } from '@ant-design/icons-vue'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'

const selectedDept = ref('ALL')

const userStore = useUserStore()

const filteredUsers = computed(() => userStore.getUsersByDept(selectedDept.value))

onMounted(async () => {
  await userStore.get()
})
</script>

<style scoped>
.select-option {
  width: 150px;
}

.wrapper-card-list {
  padding: 5px 8px;
  max-height: 460px;
  overflow-y: auto;
}
</style>

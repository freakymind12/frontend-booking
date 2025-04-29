<template>
  <a-col :span="12">
    <a-card class="wrapper-card">
      <a-flex justify="space-between">
        <h2>List of user</h2>
        <a-select
          ref="select"
          v-model:value="selectValue"
          style="width: 150px"
          :options="dept"
          @change="handleChange"
        />
      </a-flex>
      <a-flex class="user-list" vertical>
        <a-card class="user-card" v-for="user in filteredUsers" :key="user.id_user">
          <a-tag color="red"
            >{{ capitalizeEachWord(user.username) }}
            <template #icon>
              <UserOutlined />
            </template>
          </a-tag>
          <a-tag color="pink"
            >{{ user.dept }}
            <template #icon>
              <BankOutlined />
            </template>
          </a-tag>
          <a-dropdown>
            <a-tag
              class="role-tag"
              :color="user.roles == 'admin' ? 'green' : user.roles == 'staff' ? 'cyan' : 'grey'"
              >{{ capitalizeEachWord(user.roles) }}
              <template #icon>
                <LockOutlined />
              </template>
            </a-tag>
            <template #overlay>
              <a-menu>
                <a-menu-item v-if="user.roles == 'viewer'" @click="handlePromote(user)"
                  ><RiseOutlined /> Promote
                </a-menu-item>
                <a-menu-item v-if="user.roles == 'staff'" @click="handleDemote(user)"
                  ><FallOutlined /> Demote
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>

          <a-tag color="#108ee9"
            >{{ user.updated_at }}
            <template #icon>
              <FormOutlined />
            </template>
          </a-tag>
        </a-card>
        <div class="empty-list">
          <a-empty v-if="filteredUsers.length === 0"></a-empty>
        </div>
      </a-flex>
    </a-card>
  </a-col>
</template>

<script setup>
import {
  UserOutlined,
  FormOutlined,
  BankOutlined,
  LockOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons-vue'
import axios from 'axios'
import { onMounted, ref, computed } from 'vue'

const emits = defineEmits(['promote', 'demote'])
const selectValue = ref('ALL')
const dept = [
  { label: 'ALL', value: 'ALL' },
  { label: 'PE', value: 'PE' },
  { label: 'PM', value: 'PM' },
  { label: 'AL', value: 'AL' },
  { label: 'PGA', value: 'PGA' },
  { label: 'PUR', value: 'PUR' },
  { label: 'KAIZEN', value: 'KAIZEN' },
  { label: 'PC', value: 'PC' },
  { label: 'QC', value: 'QC' },
  { label: 'FINANCE', value: 'FINANCE' },
]
const userList = ref([])

const handleChange = (data) => {
  selectValue.value = data
  console.log(`selected ${data}`)
}

function capitalizeEachWord(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

const filteredUsers = computed(() => {
  if (selectValue.value === 'ALL') {
    return userList.value
  }
  return userList.value.filter((user) => user.dept === selectValue.value)
})

const fetchUser = async () => {
  try {
    const response = await axios.get('http://192.168.148.201:5050/users')
    userList.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}

const handlePromote = async (user) => {
  try {
    await axios.patch('http://192.168.148.201:5050/users/roles', {
      id_user: user.id_user,
      roles: user.roles === 'staff' ? 'admin' : 'staff'
    })
    emits('promote')
    fetchUser()
  } catch (error) {
    console.error(error)
  }
}

const handleDemote = async (user) => {
  try {
    await axios.patch('http://192.168.148.201:5050/users/roles', {
      id_user: user.id_user,
      roles: 'viewer'
    })
    emits('demote')
    fetchUser()
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await fetchUser()
})
</script>

<style scoped>
.user-card {
  padding: 0px;
  margin: 4px;
}

.user-card .ant-tag {
  font-size: 14px;
}

.role-tag:hover {
  cursor: pointer;
}

.user-list {
  height: 500px;
  padding-right: 1%;
  overflow: auto;
}

.user-list::-webkit-scrollbar {
  width: 8px;
}

.user-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.user-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.user-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.wrapper-card {
  border: solid #264d8e 1px;
}

.empty-list {
  height: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

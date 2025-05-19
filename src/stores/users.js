import { defineStore } from "pinia";
import api from "@/axios/interceptor";
import { message } from "ant-design-vue";
import { capitalizeEachWord } from "@/utils/capitalizeEachWord";

export const useUserStore = defineStore("users", {
  state: () => ({
    users: [],
    totalUsers: []
  }),

  actions: {
    async get() {
      try {
        const response = await api.get('/users')
        if (response.status === 200) {
          this.users = response.data.data.users
          this.totalUsers = response.data.data.total
        }
      } catch (error) {
        message.error(error.response.data.message)
        console.error('Failed to fetch users:', error)
      }
    },

    async update(id, data) {
      try {
        const response = await api.patch(`users/${id}`, data)
        if (response.status === 200) {
          message.success('User updated successfully')
          this.get()
        }
      } catch (error) {
        message.error(error.response.data.message)
        console.error('Failed to update user:', error)
      }
    }
  },

  getters: {
    getUsersByDept: (state) => (dept) => {
      if (dept === 'ALL') return state.users
      return state.users.filter(user => user.dept === dept)
    },

    getUserOptions: (state) => {
      return state.users.map((user) => ({
        value: user.id_user,
        label: `[${user.dept}] ${capitalizeEachWord(user.username)}`
      }))
    },
  }
})
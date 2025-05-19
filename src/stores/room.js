import { defineStore } from "pinia";
import api from "@/axios/interceptor";
import { message } from "ant-design-vue";

export const useRoomStore = defineStore("rooms", {
  state: () => ({
    rooms: [],
  }),

  actions: {
    async get(filters = {}) {
      try {
        const queryParams = new URLSearchParams(filters).toString()
        const response = await api.get(`/rooms?${queryParams}`)
        if (response.status === 200) this.rooms = response.data.data
      } catch (error) {
        message.error(error.response.data.message)
        console.error('Failed to fetch rooms:', error)
      }
    },

    async update(id, data) {
      try {
        const response = await api.patch(`/rooms/${id}`, data)
        if (response.status === 200) {
          message.success('Room updated successfully')
          this.get()
        }
      } catch (error) {
        message.error(error.response.data.message)
        console.error('Failed to update room:', error)
      }
    },

    async create(data) {
      try {
        const response = await api.post('/rooms', data)
        if (response.status === 200) {
          message.success('Room created successfully')
          this.get()
        }
      } catch (error) {
        message.error(error.response.data.message)
        console.error('Failed to create room:', error)
      }
    },

    async delete(id) {
      try {
        const response = await api.delete(`/rooms/${id}`)
        if (response.status === 200) {
          message.success('Room deleted successfully')
          this.get()
        }
      } catch (error) {
        message.error(error.response.data.message)
        console.error('Failed to delete room:', error)
      }
    }
  },
  getters: {
    getRoomById: (state) => (id) => {
      return state.rooms.find((room) => room.id_room === id)
    },
    getRoomsByName: (state) => (name) => {
      if (!name || name.trim() === '') return state.rooms
      return state.rooms.filter((room) =>
        room.room_name.toLowerCase().includes(name.toLowerCase())
      )
    },
    getRoomOptions: (state) => {
      return state.rooms.map((room) => ({
        value: room.id_room,
        label: room.room_name
      }))
    },
  }
})
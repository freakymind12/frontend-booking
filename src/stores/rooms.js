import axios from "axios";
import { defineStore } from "pinia";

export const useRoomStore = defineStore("rooms", {
  state: () => ({
    rooms: [],
    detailRoom : null
  }),
  actions: {
    async getDetailRoom(id) {
      try {
        const response = await axios.get(`http://192.168.148.201:5050/rooms/${id}`)

        if (response.status === 200) {
          this.detailRoom = response.data.data[0]
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
})
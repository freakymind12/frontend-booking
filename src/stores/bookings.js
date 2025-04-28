import axios from "axios";
import { defineStore } from "pinia";

export const useBookingsStore = defineStore("bookings", {
  state: () => ({
    bookings: [],
  }),
  actions: {
    async getBookings(filters = {}) {
      try {
        const queryParams = new URLSearchParams(
          Object.entries(filters).reduce((acc, [key, value]) => {
            if (value) acc.append(key, value)
            return acc
          }, new URLSearchParams()),
        )

        const response = await axios.get(`http://192.168.148.125:5050/bookings/queue?${queryParams}`)
        if (response.status === 200) {
          this.bookings = response.data.data
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
})
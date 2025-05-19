import { defineStore } from "pinia";
import api from "@/axios/interceptor";
import { message } from "ant-design-vue";
import dayjs from 'dayjs'

export const useBookingStore = defineStore("bookings", {
  state: () => ({
    bookings: [],
    userBookings: [],
    updateBookings: false,
    updateUserBookings: false
  }),
  actions: {
    async get(filters = {}) {
      try {
        const queryParams = new URLSearchParams(filters).toString()
        const response = await api.get(`/bookings?${queryParams}`)
        if (response.status === 200) {
          if (filters.id_user) {
            this.userBookings = response.data.data;
          } else {
            this.bookings = response.data.data;
          }
        }
      } catch (error) {
        message.error(error.response.data.message)
        console.error('Failed to fetch bookings:', error)
      }
    },

    async create(data) {
      try {
        const response = await api.post('/bookings', data)
        if (response.status === 200) {
          message.success('Booking created successfully')
        }
      } catch (error) {
        console.error('Failed to create booking:', error)
        return error.response.data
      }
    },

    async update(id, data) {
      try {
        const response = await api.patch(`/bookings/${id}`, data)
        if (response.status === 200) {
          message.success('Booking updated successfully')
        }
      } catch (error) {
        console.error('Failed to update booking:', error)
        return error.response.data
      }
    },

    async delete(id) {
      try {
        const response = await api.delete(`/bookings/${id}`)
        if (response.status === 200) {
          message.success('Booking deleted successfully')
        }
      } catch (error) {
        message.error(error.response.data.message)
        console.error('Failed to delete booking:', error)
      }
    },

    setUpdateBookings() {
      this.updateBookings = !this.updateBookings;
    },

    setUpdateUserBookings() {
      this.updateUserBookings = !this.updateUserBookings
    }
  },

  getters: {
    getBookingById: (state) => (id) => {
      return state.bookings.find((booking) => booking.id_booking === id)
    },

    getBookingByIdRoom: (state) => (id) => {
      return state.bookings
        .filter((booking) => booking.id_room === id && dayjs(booking.end).isAfter(dayjs()) && booking.status !== 'Cancel')
        .sort((a, b) => {
          const now = dayjs()
          return dayjs(a.start).diff(now) - dayjs(b.start).diff(now)
        })
    },

    sortedAscBookings: (state) => {
      return [...state.bookings].sort((a, b) => {
        return dayjs(a.start).isAfter(dayjs(b.start)) ? 1 : -1
      })
    },

    filterUserBookings: (state) => (searchString) => {
      if (!searchString) {
        return state.userBookings;
      }
      return state.userBookings.filter((booking) =>
        booking.meeting_name.toLowerCase().includes(searchString) || booking.start.toLowerCase().includes(searchString)
      );
    }
  }
})
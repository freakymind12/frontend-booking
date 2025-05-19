import { defineStore } from "pinia";
import api from "@/axios/interceptor";

export const useReportStore = defineStore("reports", {
  state: () => ({
    reports: {},
  }),
  actions: {
    async get(filters = {}) {
      try {
        const queryParams = new URLSearchParams(filters).toString()
        const response = await api.get(`/report?${queryParams}`)
        if (response.status === 200) {
          this.reports = response.data.data;
        }
      } catch (error) {
        console.error('Failed to fetch reports:', error)
      }
    },
  },
  getters: {
    formattedBookingByStatus: (state) => {
      return state.reports.bookingStatus?.map(item => ({
        value: item.total,
        name: item.status
      })) || []
    },
    formattedBookingDept: (state) => {
      const deptBookings = state.reports?.deptBookings || []
      const dept = deptBookings.map(item => item.dept)
      const totalBookings = deptBookings.map(item => item.total_bookings)
      const totalDuration = deptBookings.map(item => item.total_minutes)
      return [dept, [totalBookings, totalDuration]]
    },

    formattedRoomSummary: (state) => {
      const roomSummary = state.reports?.roomSummary || []
      const room_name = roomSummary.map(item => item.room_name)
      const total_bookings = roomSummary.map(item => item.total_bookings)
      const total_duration = roomSummary.map(item => item.total_duration_minutes)
      return [room_name, [total_bookings, total_duration]]
    }
  }
})
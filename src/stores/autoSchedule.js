import { defineStore } from "pinia";
import api from "@/axios/interceptor";
import { message } from "ant-design-vue";

export const useAutoScheduleStore = defineStore("autoSchedule", {
  state: () => ({
    schedules: [],
  }),
  actions: {
    async get() {
      try {
        const response = await api.get("/auto-schedule");
        if (response.status === 200) this.schedules = response.data.data;
      } catch (error) {
        message.error(error.response.data.message);
        console.error("Failed to fetch auto schedules:", error);
      }
    },

    async update(id, data) {
      try {
        const response = await api.patch(`/auto-schedule/${id}`, data);
        if (response.status === 200) {
          message.success("Auto Schedule updated successfully");
          this.get();
        }
      } catch (error) {
        message.error(error.response.data.message);
        console.error("Failed to update auto schedule:", error);
      }
    },

    async create(data) {
      try {
        const response = await api.post("/auto-schedule", data);
        if (response.status === 200) {
          message.success("Auto Schedule created successfully");
          this.get();
        }
      } catch (error) {
        message.error(error.response.data.message);
        console.error("Failed to create auto schedule:", error);
      }
    },

    async delete(id) {
      try {
        const response = await api.delete(`/auto-schedule/${id}`);
        if (response.status === 200) {
          message.success("Auto Schedule deleted successfully");
          this.get();
        }
      } catch (error) {
        message.error(error.response.data.message);
        console.error("Failed to delete auto schedule:", error);
      }
    }
  },

  getters: {
    getSchedulesByDay: (state) => {
      return (day) => {
        return state.schedules.filter(schedule => schedule.day === day)
      }
    },
    getConflictedSchedules: (state) => {
      return (day, start, end, id_room, id_schedule) => {
        return state.schedules.filter(schedule => {
          // hanya untuk id_schedule yang sama
          if (id_schedule && schedule.id_schedule === id_schedule) return false;

          // Hanya untuk day yang sama
          if (schedule.day !== day) return false;

          // Hanya untuk ruangan yang sama
          if (schedule.id_room !== id_room) return false;

          const scheduleStart = schedule.start.slice(0, 5); // pastikan format HH:mm
          const scheduleEnd = schedule.end.slice(0, 5);

          // Cek apakah ada overlap
          return scheduleStart < end && scheduleEnd > start;
        });
      };
    }
  }
})
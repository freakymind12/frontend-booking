<template>
  <div class="container">
    <a-flex justify="center" align="center" wrap="wrap" gap="small">
      <div class="room-info">
        <a-card class="card-room-info">
          <a-flex justify="center" align="center" gap="middle" style="margin-bottom: 1rem">
            <a-image :src="hrs" :width="100" :preview="false"></a-image>
            <h2 :class="{ 'logo-name': true, 'intro-active': isActive }">
              Meeting Room<br />
              Management
            </h2>
          </a-flex>
          <a-dropdown>
            <h2 class="room-name">{{ roomData?.room_name }}</h2>
            <template #overlay>
              <a-menu>
                <a-menu-item
                  v-for="room in roomList"
                  :key="room.id_room"
                  @click="handleChangeRoom(room.id_room)"
                >
                  {{ room?.room_name }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <p><UserOutlined /> Capacity : {{ roomData?.capacity.toLocaleString() }} persons</p>
          <p><BankOutlined /> Description : {{ roomData?.description }}</p>
          <p v-if="ongoing">
            <LoadingOutlined spin /> Ongoing :
            <a-tag color="green"
              ><template #icon> <FormOutlined /> </template>
              {{ ongoing.meeting_name }}
            </a-tag>
            <a-tag color="red"
              ><template #icon> <UserOutlined /> </template>
              {{ ongoing.username }}
            </a-tag>
          </p>
          <p v-else>
            <LoadingOutlined spin /> Ongoing :
            <a-tag color="red">No Schedule </a-tag>
          </p>

          <p v-if="upcoming">
            <ForwardOutlined /> Upcoming :
            <a-tag color="green">
              <template #icon> <FormOutlined /> </template>{{ upcoming.meeting_name }}
            </a-tag>
            <a-tag color="red"
              ><template #icon> <UserOutlined /> </template>
              {{ upcoming.username }}
            </a-tag>
          </p>
          <p v-else>
            <ForwardOutlined /> Upcoming :
            <a-tag color="red"> No Schedule </a-tag>
          </p>
          <template #actions>
            <p>{{ currentTime[0] }}</p>
            <p>{{ currentTime[1] }}</p>
          </template>
        </a-card>
      </div>

      <div class="list">
        <a-card class="card-list" v-for="booking in bookings" :key="booking.id_booking">
          <a-flex gap="small" wrap="wrap">
            <a-tag color="red"
              ><template #icon> <UserOutlined /> </template>{{ booking.username }}</a-tag
            >
            <a-tag color="cyan">
              <template #icon> <clock-circle-outlined /> </template
              >{{ calculateDuration(booking.start, booking.end) }} min</a-tag
            >
            <a-tag color="green">
              <template #icon> <FormOutlined /> </template>{{ booking.meeting_name }}</a-tag
            >
            <a-tag color="#108ee9"> Start : {{ booking.start.split('T')[0] }} </a-tag>
            <a-tag color="#108ee9">End : {{ booking.end.split('T')[0] }}</a-tag>
            <a-tag color="blue" v-if="isPassed(booking)"
              ><template #icon>
                <CheckCircleOutlined />
              </template>
              Finished
            </a-tag>
          </a-flex>
        </a-card>
      </div>
      <a-card class="empty-list" v-if="bookings.length === 0">
        <a-empty style="width: 210px">
          <template #description> No Bookings List </template>
        </a-empty>
      </a-card>
    </a-flex>
  </div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ClockCircleOutlined,
  FormOutlined,
  UserOutlined,
  BankOutlined,
  LoadingOutlined,
  ForwardOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'
import hrs from '@/assets/hrs.png'

const route = useRoute()
const router = useRouter()
const isActive = ref(false)
const bookings = ref([])
const roomData = ref(null)
const roomList = ref([])
let idroom = route.params.idroom
const currentTime = ref('')
const ongoing = ref('')
const upcoming = ref('')
let timer, bookingsInterval

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const monthIndex = date.getMonth()
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  // Array nama bulan
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Des'
  ]

  // Format tanggal
  return [`${day} ${months[monthIndex]} ${year}`, `${hours}:${minutes}:${seconds}`]
}

const isPassed = (booking) => {
  const now = new Date()
  const end = new Date(booking.end)
  return now > end
}

const calculateDuration = (startDateTime, endDateTime) => {
  const start = new Date(startDateTime)
  const end = new Date(endDateTime)
  const differenceInMinutes = Math.round((end - start) / (1000 * 60)).toLocaleString()
  return differenceInMinutes
}

const fetchBookingList = async (room) => {
  const now = new Date()
  const formattedDate =
    now.getFullYear() +
    '-' +
    String(now.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(now.getDate()).padStart(2, '0')

  try {
    const response = await axios.get(
      `http://192.168.148.125:5151/bookings/queue?id_room=${room}&date=${formattedDate}`
    )
    bookings.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}

const updateClock = () => {
  currentTime.value = formatDate(new Date())
}

const fetchRoom = async (room) => {
  try {
    const response = await axios.get(`http://192.168.148.125:5151/rooms/${room}`)
    roomData.value = response.data.data[0]
  } catch (error) {
    console.error(error)
  }
}

const updateOngoingAndUpcoming = () => {
  const now = new Date()

  const sortedBookings = bookings.value
    .slice()
    .sort((a, b) => new Date(a.start) - new Date(b.start))

  // Cari booking yang sedang berlangsung (ongoing)
  ongoing.value = sortedBookings.find((booking) => {
    const start = new Date(booking.start)
    const end = new Date(booking.end)
    return now >= start && now <= end
  })

  // Jika ada ongoing, cari booking yang upcoming setelah ongoing
  if (ongoing.value) {
    upcoming.value = sortedBookings.find((booking) => {
      const start = new Date(booking.start)
      return start > new Date(ongoing.value.end) // Cari setelah end dari ongoing
    })
  } else {
    // Jika tidak ada ongoing, cari booking yang upcoming setelah waktu saat ini
    upcoming.value = sortedBookings.find((booking) => {
      const start = new Date(booking.start)
      return start > now
    })
  }
}

const fetchAllRoom = async () => {
  try {
    const response = await axios.get(`http://192.168.148.125:5151/rooms`)
    roomList.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}

const handleChangeRoom = (roomId) => {
  router.push(`/queue/${roomId}`)
}

onMounted(() => {
  fetchBookingList(idroom).then(() => {
    updateOngoingAndUpcoming()
  })

  bookingsInterval = setInterval(() => {
    fetchBookingList(idroom)
  }, 3000)

  fetchRoom(idroom)

  updateClock()

  fetchAllRoom()

  timer = setInterval(() => {
    updateClock()
    updateOngoingAndUpcoming()
  }, 1000)

  setTimeout(() => {
    isActive.value = true
  }, 100)
})

onUnmounted(() => {
  clearInterval(timer)
  clearInterval(bookingsInterval)
})

watch(
  () => route.params.idroom,
  (newIdRoom) => {
    idroom = newIdRoom
    fetchBookingList(newIdRoom)
    fetchRoom(newIdRoom)
  }
)
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.room-info {
  height: 410px;
}

.list,
.empty-list {
  height: 410px;
  overflow: auto;
  scrollbar-width: none;
}

.list::-webkit-scrollbar {
  display: none;
}

.card-list {
  width: 300px;
  margin-bottom: 1rem;
}

.card-room-info {
  width: 500px;
  height: inherit;
}

.ant-card {
  border: 1px solid #264d8e;
}

.empty-list {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-name {
  margin-bottom: 0px;
  font-family: monospace;
  font-weight: 600;
  opacity: 0; /* Start with hidden */
  transform: scale(0.8); /* Mulai dengan ukuran lebih kecil */
  transition:
    opacity 0.8s ease-out,
    transform 0.8s ease-out;
}

.logo-name.intro-active {
  opacity: 1; /* Setelah kelas ditambahkan, elemen terlihat */
  transform: scale(1); /* Kembali ke ukuran normal */
}

.room-name:hover {
  cursor: pointer;
  color: #264d8e;
}
</style>

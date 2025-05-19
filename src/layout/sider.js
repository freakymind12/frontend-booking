export default [
  {
    key: '1',
    icon: 'DashboardOutlined',
    title: 'Home',
    path: '/dashboard',
    role: ['admin', 'staff', 'viewer'],
    // children: []
  },
  {
    key: '2',
    icon: 'ScheduleOutlined',
    title: 'Booking',
    path: '/booking',
    role: ['admin', 'staff', 'viewer'],
  },
  {
    key: '3',
    icon: 'DatabaseOutlined',
    title: 'Admin',
    path: '/admin',
    role: ['admin'],
  },
]

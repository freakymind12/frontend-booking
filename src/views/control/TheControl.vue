<template>
  <div class="banner">
    <h1>Control User</h1>
    <p>Control user roles easily by table bellow</p>
  </div>
  <div class="wrapper">
    <a-flex justify="center" align="center">
      <UserList @promote="handlePromote" @demote="handleDemote" />
    </a-flex>
  </div>
</template>

<script setup>
import UserList from './UserList.vue'
import { message } from 'ant-design-vue'

const handlePromote = () => {
  message.success('Success promote roles')
}

const handleDemote = () => {
  message.success('Success demote roles')
}
</script>

<style scoped>
.banner {
  text-align: center;
}
.banner h1 {
  font-size: 2.5rem;
}
.banner p {
  font-size: 1rem;
}
.wrapper {
  padding: 20px;
}
</style>

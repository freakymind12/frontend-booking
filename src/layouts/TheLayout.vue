<template>
  <a-layout class="layout">
    <Header />
    <a-layout-content class="content">
      <RouterView />
    </a-layout-content>
    <Footer />
  </a-layout>
</template>

<script setup>
import Header from './TheHeader.vue'
import Footer from './TheFooter.vue'
import { RouterView } from 'vue-router'
</script>

<style scoped>
.layout {
  min-height: 100vh;
}
.content {
  padding: 10px;
  background: #ffffff;
}
</style>

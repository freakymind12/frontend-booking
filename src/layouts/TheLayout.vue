<template>
  <a-layout class="layout">
    <Header />
    <a-layout-content class="content">
      <RouterView />
      <ModalTranslate :visible="visible" @cancel="closeModal"/>
      <FloatButton @click="openModal"/>
    </a-layout-content>
    <Footer />
  </a-layout>
</template>

<script setup>
import Header from './TheHeader.vue'
import Footer from './TheFooter.vue'
import FloatButton from '@/components/FloatButton.vue'
import ModalTranslate from '@/components/ModalTranslate.vue'
import { RouterView } from 'vue-router'
import { ref } from 'vue'

const visible = ref(false)

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
}
.content {
  background: #ffffff;
}
</style>

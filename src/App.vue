<template>
  <a-config-provider :theme="theme">
    <RouterView />
  </a-config-provider>
</template>

<script setup>
const theme = {
  token: {
    fontFamily: 'Nunito, Arial',
    colorPrimary: '#264d8e',
  },
}
</script>

<style scoped></style>

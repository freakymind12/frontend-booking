<template>
  <a-flex justify="center">
    <GoogleTranslateSelect
      default-language-code="en"
      default-page-language-code="en"
      :fetch-browser-language="false"
      trigger="click"
      :showArrow="false"
      @select="handleGoogleTranslateSelect"
    />
  </a-flex>
</template>

<script setup>
import GoogleTranslateSelect from '@google-translate-select/vue3' // Sesuaikan ke versi Vue 3
const handleGoogleTranslateSelect = (language) => {
  console.log(language)
}
</script>

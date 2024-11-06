<template>
  <a-modal v-model:open="props.visible" @cancel="emits('close')" :footer="null">
    <h2>Select Languages</h2>
    <GoogleTranslateSelect
      default-language-code="en"
      default-page-language-code="en"
      :fetch-browser-language="false"
      trigger="click"
      :showArrow="false"
      @select="handleGoogleTranslateSelect"
    />
  </a-modal>
</template>

<script setup>
import GoogleTranslateSelect from '@google-translate-select/vue3' 

const emits = defineEmits(['close'])
const props = defineProps({
  visible: Boolean
})

const handleGoogleTranslateSelect = (language) => {
  console.log(language)
}
</script>

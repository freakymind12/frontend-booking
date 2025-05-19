<template>
  <a-card size="small" :hoverable="true">
    <v-chart :style="{ height: props.height }" :option="option" autoresize />
  </a-card>
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, provide, watch, computed } from 'vue'

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

provide(THEME_KEY, 'light')

const props = defineProps({
  height: {
    type: String,
    default: '400px',
  },
  title: {
    type: String,
    default: 'Title Chart',
  },
  subTitle: {
    type: String,
    default: 'Subtitle Chart',
  },
  data: {
    type: Array,
    default: () => [],
  },
})

const total = computed(() => props.data.reduce((sum, item) => sum + (item.value || 0), 0))

const option = ref({
  color: ['#FAC858', '#91CAFF', '#91CC75'],
  title: {
    text: props.title,
    subtext: null,
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      type: 'pie',
      radius: ['10%', '50%'],
      data: props.data,
      label: {
        show: true,
        position: 'outside',
        formatter: (params) => {
          const { name, value, percent } = params
          return `{bold|${name}}\n\n${value} Bookings\n${percent}%`
        },
        fontSize: 12,
        color: '#393E46',
        rich: {
          bold: {
            fontFamily: 'Nunito',
            fontWeight: 'bold',
            fontSize: 13,
            color: '#727272', // warna untuk teks tebal
          },
        },
      },
      labelLine: {
        show: true,
        length: 30,
        length2: 15,
        lineStyle: {
          width: 1,
          type: 'solid',
          color: '#999',
        },
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
})

watch(
  () => props.data,
  (newData) => {
    option.value.series[0].data = newData
    option.value.title.subtext = `Total : ${total.value} ${props.subTitle}`
  },
  { deep: true, immediate: true }, // ⬅️ Langsung jalan pertama kali juga
)
</script>

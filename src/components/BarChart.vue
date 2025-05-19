<template>
  <v-chart
    :style="{ height: props.height }"
    :option="options"
    autoresize
    v-if="props.yAxisData[0].length > 0"
  />
  <a-flex justify="center" align="center" v-else :style="{ height: props.height }">
    <a-empty description="There is no data to show" />
  </a-flex>
</template>

<script setup>
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { ToolboxComponent, GridComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart, { THEME_KEY } from 'vue-echarts'
import { provide, ref, watch } from 'vue'

use([ToolboxComponent, GridComponent, BarChart, CanvasRenderer, LegendComponent])

provide(THEME_KEY, 'light')

const props = defineProps({
  height: {
    type: String,
    default: '300px',
  },
  title: {
    type: String,
    default: 'Title Chart',
  },
  xAxisData: {
    type: Array,
    default: () => [],
  },
  yAxisData: {
    type: Array,
    default: () => [],
  },
})

const options = ref({
  color: ['#91CAFF', '#FAC858', '#EE6666', '#91CC75', '#73C0DE'],
  legend: {
    top: 'top',
    left: 'center',
    orient: 'horizontal',
    itemGap: 20,
    textStyle: {
      fontSize: 12,
      fontFamily: 'Nunito',
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    formatter: function (params) {
      let tooltip = `<strong>${params[0].name}</strong><br/>`
      params.forEach((item) => {
        tooltip += `${item.marker} ${item.seriesName}: ${Number(item.value).toLocaleString('id-ID')}<br/>`
      })
      return tooltip
    },
  },

  xAxis: {
    type: 'category',
    data: props.xAxisData,
    axisLabel: {
      formatter: function (value) {
        const words = value.split(' ')
        let formattedLabel = ''

        // Baris pertama hanya satu kata
        formattedLabel += words[0] + '\n'

        // Sisa kata-kata dimasukkan ke baris kedua
        if (words.length > 1) {
          formattedLabel += words.slice(1).join(' ')
        }

        return formattedLabel
      },
    },
  },

  yAxis: [
    {
      type: 'value',
      name: 'Bookings',
      splitLine: { show: false },
    },
    {
      type: 'value',
      name: 'Duration (min)',
      splitLine: { show: false },
    },
  ],

  series: [
    {
      name: `Total ${props.title}`,
      data: props.yAxisData[0],
      barGap: '3%',
      type: 'bar',
      yAxisIndex: 0,
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
      label: {
        show: true,
        rotate: 90,
        position: 'inside',
        color: '#333',
        fontWeight: 'bold',
        fontFamily: 'Nunito',
        fontSize: 12,
        formatter: (params) => {
          return `${params.value.toLocaleString()}x`
        },
      },
    },
    {
      name: 'Total Duration',
      data: props.yAxisData[1],
      type: 'bar',
      yAxisIndex: 1,
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
      label: {
        show: true,
        rotate: 90,
        position: 'inside',
        color: '#333',
        fontWeight: 'bold',
        fontFamily: 'Nunito',
        fontSize: 12,
        formatter: (params) => {
          return `${Number(params.value).toLocaleString('id-ID')} min`
        },
      },
    },
  ],
})

watch(
  () => props.yAxisData,
  (newData) => {
    console.log(props.yAxisData)
    options.value.xAxis.data = props.xAxisData
    options.value.series[0].data = newData[0]
    options.value.series[1].data = newData[1]
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>

<template>
  <div class="w-full h-full">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    default: 'pie',
    validator: (value) => ['pie', 'doughnut', 'bar', 'line'].includes(value)
  },
  options: {
    type: Object,
    default: () => ({})
  },
  colors: {
    type: Array,
    default: () => [
      '#8B5CF6', // Purple
      '#06B6D4', // Cyan
      '#10B981', // Emerald  
      '#F59E0B', // Amber
      '#EF4444', // Red
      '#6366F1', // Indigo
      '#EC4899', // Pink
      '#84CC16'  // Lime
    ]
  }
})

const chartCanvas = ref(null)
let chartInstance = null

// Chart.js será carregado dinamicamente
let Chart = null

const loadChartJS = async () => {
  if (Chart) return Chart

  try {
    const chartModule = await import('chart.js/auto')
    Chart = chartModule.default
    return Chart
  } catch (error) {
    console.error('Erro ao carregar Chart.js:', error)
    return null
  }
}

const createChart = async () => {
  if (!chartCanvas.value || !props.data.length) return

  await loadChartJS()
  if (!Chart) return

  const ctx = chartCanvas.value.getContext('2d')

  // Destruir chart anterior se existir
  if (chartInstance) {
    chartInstance.destroy()
  }

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    }
  }

  let chartData
  
  if (props.type === 'pie' || props.type === 'doughnut') {
    chartData = {
      labels: props.data.map(item => item.label || item.name || ''),
      datasets: [{
        data: props.data.map(item => item.value || item.count || 0),
        backgroundColor: props.colors,
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    }
  } else if (props.type === 'bar') {
    chartData = {
      labels: props.data.map(item => item.label || item.name || ''),
      datasets: [{
        label: 'Quantidade',
        data: props.data.map(item => item.value || item.count || item.total || 0),
        backgroundColor: props.colors[0] + '80',
        borderColor: props.colors[0],
        borderWidth: 2,
        borderRadius: 4
      }]
    }
  } else if (props.type === 'line') {
    // Dependendo dos dados, podemos ter múltiplas séries
    if (props.data.length > 0 && props.data[0].created !== undefined) {
      // Dados de produtividade
      chartData = {
        labels: props.data.map(item => item.period || ''),
        datasets: [
          {
            label: 'Criadas',
            data: props.data.map(item => item.created || 0),
            borderColor: '#3B82F6', // Blue
            backgroundColor: '#3B82F6' + '20',
            borderWidth: 2,
            fill: false,
            tension: 0.4
          },
          {
            label: 'Concluídas',
            data: props.data.map(item => item.completed || 0),
            borderColor: '#10B981', // Green
            backgroundColor: '#10B981' + '20',
            borderWidth: 2,
            fill: false,
            tension: 0.4
          },
          {
            label: 'Em Progresso',
            data: props.data.map(item => item.inProgress || item.in_progress || 0),
            borderColor: '#F59E0B', // Amber
            backgroundColor: '#F59E0B' + '20',
            borderWidth: 2,
            fill: false,
            tension: 0.4
          }
        ]
      }
    } else {
      // Outros dados de linha
      chartData = {
        labels: props.data.map(item => item.label || item.name || item.period || ''),
        datasets: [{
          label: 'Produtividade',
          data: props.data.map(item => item.value || item.count || 0),
          borderColor: props.colors[0],
          backgroundColor: props.colors[0] + '20',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: props.colors[0],
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6
        }]
      }
    }
  }

  const mergedOptions = {
    ...defaultOptions,
    ...props.options
  }

  chartInstance = new Chart(ctx, {
    type: props.type,
    data: chartData,
    options: mergedOptions
  })
}

const updateChart = async () => {
  await nextTick()
  await createChart()
}

watch(() => props.data, updateChart, { deep: true })
watch(() => props.type, updateChart)

onMounted(async () => {
  await updateChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
canvas {
  max-height: 400px;
}
</style>

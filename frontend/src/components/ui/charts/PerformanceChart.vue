<template>
    <a-card :bordered="false" class="shadow-sm h-full">
        <!-- Header -->
        <template #title>
            <span class="text-lg font-semibold">Performance</span>
        </template>
        <template #extra>
            <a-dropdown>
                <a-button type="text" size="small" shape="circle">
                    <IconMore class="cursor-pointer" />
                </a-button>
                <template #overlay>
                    <a-menu>
                        <a-menu-item key="1">
                            <IconEye class="w-4 h-4 inline mr-2" />
                            Batafsil
                        </a-menu-item>
                        <a-menu-item key="2">
                            <IconExcel class="w-4 h-4 inline mr-2" />
                            Export
                        </a-menu-item>
                        <a-menu-item key="3">
                            <IconRefresh class="w-4 h-4 inline mr-2" />
                            Yangilash
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </template>

        <!-- Chart -->
        <div class="relative">
            <VueApexCharts 
                type="radialBar" 
                height="280" 
                :options="chartOptions" 
                :series="series" 
            />

            <!-- Center Content -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div class="text-4xl font-bold text-gray-900">{{ performanceValue }}</div>
                <div class="text-sm text-gray-500 mt-1">
                    of {{ maxValue }} max 
                    <span class="text-gray-400">{{ label }}</span>
                </div>
            </div>
        </div>

        <!-- Semester Info -->
        <div class="text-center mt-4 text-sm text-gray-700">
            {{ semesterInfo }}
        </div>
    </a-card>
</template>

<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import IconMore from '@/components/icon/IconMore.vue'
import IconEye from '@/components/icon/IconEye.vue'
import IconExcel from '@/components/icon/IconExcel.vue'
import IconRefresh from '@/components/icon/IconRefresh.vue'

const props = defineProps({
    performanceValue: {
        type: Number,
        default: 9.2
    },
    maxValue: {
        type: Number,
        default: 10
    },
    label: {
        type: String,
        default: 'LT'
    },
    semesterInfo: {
        type: String,
        default: '1st Semester - 2nd Semester'
    }
})

const percentage = computed(() => {
    return (props.performanceValue / props.maxValue) * 100
})

const series = computed(() => [percentage.value])

const chartOptions = computed(() => ({
    chart: {
        type: 'radialBar',
        sparkline: {
            enabled: false
        }
    },
    plotOptions: {
        radialBar: {
            startAngle: -90,
            endAngle: 90,
            hollow: {
                margin: 0,
                size: '70%',
                background: 'transparent'
            },
            track: {
                show: true,
                background: '#f1f5f9',
                strokeWidth: '97%',
                margin: 5
            },
            dataLabels: {
                show: false
            }
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'light',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#FCD34D'],
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
            colorStops: [
                {
                    offset: 0,
                    color: '#60A5FA',
                    opacity: 1
                },
                {
                    offset: 100,
                    color: '#FCD34D',
                    opacity: 1
                }
            ]
        }
    },
    colors: ['#60A5FA'],
    stroke: {
        lineCap: 'round',
        curve: 'smooth'
    },
    labels: ['']
}))
</script>

<style scoped>
:deep(.apexcharts-radialbar-track) {
    fill: #f1f5f9;
}
</style>


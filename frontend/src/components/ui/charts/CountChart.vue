<template>
    <a-card :bordered="false" class="shadow-sm h-full">
        <!-- Header -->
        <template #title>
            <a-space>
                <span>{{ title }}</span>
            </a-space>
        </template>
        <template #extra>
            <a-dropdown>
                <a-button type="text" size="small" shape="circle">
                    <IconBar class="cursor-pointer" width="20" height="20" />
                </a-button>
                <template #overlay>
                    <a-menu>
                        <a-menu-item key="1">
                            <IconEye class="w-4 h-4 inline mr-2" />
                            Ko'rish
                        </a-menu-item>
                        <a-menu-item key="2">
                            <IconExcel class="w-4 h-4 inline mr-2" />
                            Export
                        </a-menu-item>
                        <a-menu-item 
                            key="3"
                            @click="handleRefresh"
                            :disabled="loading"    
                        >
                            <IconRefresh class="w-4 h-4 inline mr-2" />
                            Yangilash
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </template>

        <!-- Chart -->
        <div class="relative">
            <a-spin :spinning="loading" tip="Yuklanmoqda...">
                <VueApexCharts 
                    type="radialBar" 
                    height="280" 
                    :options="chartOptions" 
                    :series="series" 
                />
            </a-spin>
            <!-- Center Icons -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2">
                <IconBoy class="text-[#3498F5] w-8 h-8" />
                <IconGirl class="text-[#fc038c] w-8 h-8" />
            </div>
        </div>

        <!-- Legend with Statistics -->
        <a-row :gutter="16" class="mt-4">
            <a-col :span="8">
                <a-statistic 
                    title="Jami" 
                    :value="totalCount" 
                    :value-style="{ color: '#FAE27C', fontSize: '20px' }"
                    :precision="0"
                    :loading="loading"
                >
                    <template #prefix>
                        <a-badge color="#FAE27C" />
                    </template>
                    <template #suffix>
                        <span class="text-xs text-gray-400">(100%)</span>
                    </template>
                </a-statistic>
            </a-col>
            <a-col :span="8">
                <a-statistic 
                    title="O'g'il bolalar" 
                    :value="boysCountValue" 
                    :value-style="{ color: '#3498F5', fontSize: '20px' }"
                    :precision="0"
                    :loading="loading"
                >
                    <template #prefix>
                        <a-badge color="#3498F5" />
                    </template>
                    <template #suffix>
                        <span class="text-xs text-gray-400">({{ boysPercentage }}%)</span>
                    </template>
                </a-statistic>
            </a-col>
            <a-col :span="8">
                <a-statistic 
                    title="Qiz bolalar" 
                    :value="girlsCountValue" 
                    :value-style="{ color: '#fc038c', fontSize: '20px' }"
                    :precision="0"
                    :loading="loading"
                >
                    <template #prefix>
                        <a-badge color="#fc038c" />
                    </template>
                    <template #suffix>
                        <span class="text-xs text-gray-400">({{ girlsPercentage }}%)</span>
                    </template>
                </a-statistic>
            </a-col>
        </a-row>
    </a-card>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import IconBoy from '@/components/icon/IconBoy.vue'
import IconGirl from '@/components/icon/IconGirl.vue'
import IconBar from '@/components/icon/IconBar.vue'
import IconEye from '@/components/icon/IconEye.vue'
import IconExcel from '@/components/icon/IconExcel.vue'
import IconRefresh from '@/components/icon/IconRefresh.vue'
import { useDashboardStore } from '@/store/dashboard/dashboard.pinia'

const props = defineProps({
    title: {
        type: String,
        default: 'O\'quvchilar'
    },
    boysCount: {
        type: Number,
        default: null
    },
    girlsCount: {
        type: Number,
        default: null
    },
    autoFetch:{
        type: Boolean,
        default: true
    }
})

const dashboardStore = useDashboardStore();

const boysCountValue = computed(() => {
    return props.boysCount !== null ? props.boysCount : dashboardStore.getBoysCount;
})

const girlsCountValue = computed(() => {
    return props.girlsCount !== null ? props.girlsCount : dashboardStore.getGirlsCount;
})

const loading = computed(() => dashboardStore.isStudentsCountLoading);

const totalCount = computed(() => boysCountValue.value + girlsCountValue.value)

const boysPercentage = computed(() => {
    return totalCount.value > 0 ? Math.round((boysCountValue.value / totalCount.value) * 100) : 0
})

const girlsPercentage = computed(() => {
    return totalCount.value > 0 ? Math.round((girlsCountValue.value / totalCount.value) * 100) : 0
})

// Component mount bo'lganda ma'lumotlarni yuklash
onMounted(async () => {
    if (props.autoFetch && props.boysCount === null && props.girlsCount === null) {
        await dashboardStore.fetchStudentsCountStatistics();
    }
})

// Refresh funksiyasi
const handleRefresh = async () => {
    if (props.autoFetch && props.boysCount === null && props.girlsCount === null) {
        await dashboardStore.fetchStudentsCountStatistics(true);
    }
}

const series = computed(() => {
    if (totalCount.value === 0) return [0, 0];
    return [boysPercentage.value, girlsPercentage.value];
})
const chartOptions = computed(() => ({
    chart: {
        type: 'radialBar',
        sparkline: {
            enabled: true
        }
    },
    plotOptions: {
        radialBar: {
            hollow: {
                margin: 0,
                size: '40%'
            },
            track: {
                margin: 5,
                background: '#f1f5f9'
            },
            dataLabels: {
                show: false
            }
        }
    },
    colors: ['#3498F5', '#fc038c'],
    stroke: {
        lineCap: 'round'
    },
    labels: ['Boys', 'Girls']
}))
</script>

<style scoped></style>


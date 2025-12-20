<template>
    <div class="flex-1 p-4">
        <a-row :gutter="[16, 16]">
            <!-- Left Side -->
            <a-col :xs="24" :xl="16">
                <a-space direction="vertical" :size="16" class="w-full">
                    <!-- Top Section -->
                    <a-row :gutter="[16, 16]">
                        <!-- User Info Card -->
                        <a-col :xs="24" :lg="12">
                            <a-card :bordered="false" class="bg-blue-50">
                                <a-row :gutter="16" align="middle">
                                    <a-col :span="8">
                                        <a-avatar 
                                            :size="144" 
                                            :src="'https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Photos.png'"
                                            class="w-full"
                                        />
                                    </a-col>
                                    <a-col :span="16">
                                        <a-space direction="vertical" :size="12" class="w-full">
                                            <a-typography-title :level="4" class="!mb-0">
                                                Leonard Snyder
                                            </a-typography-title>
                                            <a-typography-paragraph class="!mb-0 text-gray-500">
                                                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                                            </a-typography-paragraph>
                                            <a-descriptions :column="1" size="small" :bordered="false">
                                                <a-descriptions-item>
                                                    <template #label>
                                                        <a-space>
                                                            <img src="@/assets/imgs/blood.png" alt="Blood" width="16" height="16" />
                                                            <span>Qon guruhi</span>
                                                        </a-space>
                                                    </template>
                                                    A++
                                                </a-descriptions-item>
                                                <a-descriptions-item>
                                                    <template #label>
                                                        <a-space>
                                                            <img src="@/assets/imgs/date.png" alt="Date" width="16" height="16" />
                                                            <span>Sana</span>
                                                        </a-space>
                                                    </template>
                                                    January 2025
                                                </a-descriptions-item>
                                                <a-descriptions-item>
                                                    <template #label>
                                                        <a-space>
                                                            <img src="@/assets/imgs/mail.png" alt="Email" width="16" height="16" />
                                                            <span>Email</span>
                                                        </a-space>
                                                    </template>
                                                    leonard@gmail.com
                                                </a-descriptions-item>
                                                <a-descriptions-item>
                                                    <template #label>
                                                        <a-space>
                                                            <img src="@/assets/imgs/phone.png" alt="Phone" width="16" height="16" />
                                                            <span>Telefon</span>
                                                        </a-space>
                                                    </template>
                                                    +998 90 123 45 67
                                                </a-descriptions-item>
                                            </a-descriptions>
                                        </a-space>
                                    </a-col>
                                </a-row>
                            </a-card>
                        </a-col>
                        <!-- Statistics Cards -->
                        <a-col :xs="24" :lg="12">
                            <a-row :gutter="[16, 16]" class="statistics-row">
                                <a-col :xs="12" :md="12" :xl="12">
                                    <a-card :bordered="false" class="shadow-sm statistics-card">
                                        <a-statistic
                                            title="Attendance"
                                            :value="90"
                                            suffix="%"
                                            :value-style="{ color: '#1890ff' }"
                                        >
                                            <template #prefix>
                                                <img src="@/assets/imgs/singleAttendance.png" alt="Attendance" width="24" height="24" />
                                            </template>
                                        </a-statistic>
                                    </a-card>
                                </a-col>
                                <a-col :xs="12" :md="12" :xl="12">
                                    <a-card :bordered="false" class="shadow-sm statistics-card">
                                        <a-statistic
                                            title="Branches"
                                            :value="2"
                                            :value-style="{ color: '#1890ff' }"
                                        >
                                            <template #prefix>
                                                <img src="@/assets/imgs/singleBranch.png" alt="Branches" width="24" height="24" />
                                            </template>
                                        </a-statistic>
                                    </a-card>
                                </a-col>
                                <a-col :xs="12" :md="12" :xl="12">
                                    <a-card :bordered="false" class="shadow-sm statistics-card">
                                        <a-statistic
                                            title="Lessons"
                                            :value="6"
                                            :value-style="{ color: '#1890ff' }"
                                        >
                                            <template #prefix>
                                                <img src="@/assets/imgs/singleLesson.png" alt="Lessons" width="24" height="24" />
                                            </template>
                                        </a-statistic>
                                    </a-card>
                                </a-col>
                                <a-col :xs="12" :md="12" :xl="12">
                                    <a-card :bordered="false" class="shadow-sm statistics-card">
                                        <a-statistic
                                            title="Classes"
                                            :value="6"
                                            :value-style="{ color: '#1890ff' }"
                                        >
                                            <template #prefix>
                                                <img src="@/assets/imgs/singleClass.png" alt="Classes" width="24" height="24" />
                                            </template>
                                        </a-statistic>
                                    </a-card>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                    <!-- Bottom Section - Schedule -->
                    <a-card :bordered="false" class="shadow-sm" :body-style="{ height: '800px', padding: '16px' }">
                        <template #title>
                            <span class="text-lg font-semibold">Teacher's Schedule</span>
                        </template>
                        <BigCalendar />
                    </a-card>
                </a-space>
            </a-col>
            <!-- Right Side -->
            <a-col :xs="24" :xl="8">
                <a-space direction="vertical" :size="16" class="w-full">
                    <!-- Shortcuts Card -->
                    <a-card :bordered="false" class="shadow-sm">
                        <template #title>
                            <span class="text-lg font-semibold">ShortCuts</span>
                        </template>
                        <a-space wrap :size="[8, 8]">
                            <a-tag color="blue" class="cursor-pointer hover:bg-blue-200 transition-colors">
                                <router-link to="#" class="text-blue-500 hover:text-blue-700">
                                    Teacher's Classes
                                </router-link>
                            </a-tag>
                            <a-tag color="blue" class="cursor-pointer hover:bg-blue-200 transition-colors">
                                <router-link to="#" class="text-blue-500 hover:text-blue-700">
                                    Teacher's Students
                                </router-link>
                            </a-tag>
                            <a-tag color="blue" class="cursor-pointer hover:bg-blue-200 transition-colors">
                                <router-link to="#" class="text-blue-500 hover:text-blue-700">
                                    Teacher's Lessons
                                </router-link>
                            </a-tag>
                            <a-tag color="blue" class="cursor-pointer hover:bg-blue-200 transition-colors">
                                <router-link to="#" class="text-blue-500 hover:text-blue-700">
                                    Teacher's Exams
                                </router-link>
                            </a-tag>
                            <a-tag color="blue" class="cursor-pointer hover:bg-blue-200 transition-colors">
                                <router-link to="#" class="text-blue-500 hover:text-blue-700">
                                    Teacher's Assignments
                                </router-link>
                            </a-tag>
                        </a-space>
                    </a-card>
                    <PerformanceChart />
                    <Announcements />
                </a-space>
            </a-col>
        </a-row>
    </div>
</template>

<script setup>
import BigCalendar from '@/components/ui/calendars/BigCalendar.vue';
import Announcements from '@/components/ui/Announcements.vue';
import PerformanceChart from '@/components/ui/charts/PerformanceChart.vue';
</script>

<style scoped>
:deep(.ant-card) {
    border-radius: 8px;
}

:deep(.ant-statistic-title) {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 8px;
}

:deep(.ant-statistic-content) {
    display: flex;
    align-items: center;
    gap: 8px;
}

:deep(.ant-tag) {
    padding: 4px 12px;
    border-radius: 6px;
    margin: 0;
}

.statistics-row {
    height: 100%;
}

.statistics-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.statistics-card :deep(.ant-card-body) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}
</style>
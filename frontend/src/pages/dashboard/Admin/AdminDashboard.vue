<template>
  <div class="p-4">
    <!-- Welcome Alert -->
    <!-- <a-alert
      message="Admin Dashboard"
      description="Markaz boshqaruv tizimiga xush kelibsiz. Umumiy statistika va ma'lumotlar."
      type="info"
      show-icon
      closable
      class="mb-4"
    /> -->

    <!-- Main Content with Loading -->
    <a-spin :spinning="loading" tip="Yuklanmoqda...">
      <a-row :gutter="[16, 16]">
        <!-- Left Side - Statistics and Charts -->
        <a-col :xs="24" :lg="16">
          <a-space direction="vertical" :size="16" style="width: 100%">
            <!-- User Statistics Cards -->
            <a-row :gutter="[16, 16]">
              <a-col :xs="24" :sm="12" :lg="6">
                <UserCard type="admin" :count="userCounts.admin" />
              </a-col>
              <a-col :xs="24" :sm="12" :lg="6">
                <UserCard type="student" :count="userCounts.student" />
              </a-col>
              <a-col :xs="24" :sm="12" :lg="6">
                <UserCard type="teacher" :count="userCounts.teacher" />
              </a-col>
              <a-col :xs="24" :sm="12" :lg="6">
                <UserCard type="parent" :count="userCounts.parent" />
              </a-col>
            </a-row>

            <!-- Charts Row -->
            <a-row :gutter="[16, 16]">
              <a-col :xs="24" :lg="12">
                <CountChart />
              </a-col>
              <a-col :xs="24" :lg="12">
                <AttendanceChart />
              </a-col>
            </a-row>

            <!-- Finance Chart -->
            <a-row>
              <a-col :span="24">
                <FinanceChart />
              </a-col>
            </a-row>
          </a-space>
        </a-col>

        <!-- Right Side - Calendar and Announcements -->
        <a-col :xs="24" :lg="8">
          <a-space direction="vertical" :size="16" style="width: 100%">
            <EventCalendar />
            <Announcements />
          </a-space>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue';
import UserCard from '@/components/ui/cards/UserCard.vue';
import CountChart from '@/components/ui/charts/CountChart.vue';
import AttendanceChart from '@/components/ui/charts/AttendanceChart.vue';
import FinanceChart from '@/components/ui/charts/FinanceChart.vue';
import EventCalendar from '@/components/ui/calendars/EventCalendar.vue';
import Announcements from '@/components/ui/Announcements.vue';
import { useDashboardStore } from '@/store/dashboard/dashboard.pinia';

// Dashboard store
const dashboardStore = useDashboardStore();

// Loading state - store'dan olish
const loading = computed(() => dashboardStore.isLoading);

// User countlarni store'dan olish
const userCounts = computed(() => ({
  admin: dashboardStore.getUserCount('admin'),
  student: dashboardStore.getUserCount('student'),
  teacher: dashboardStore.getUserCount('teacher'),
  parent: dashboardStore.getUserCount('parent'),
}));

// Component mount bo'lganda statistikalarni yuklash
onMounted(async () => {
  await Promise.all([
    dashboardStore.fetchStatistics(),
    dashboardStore.fetchStudentsCountStatistics()
  ]);
});

// Component unmount bo'lganda store'ni tozalash (ixtiyoriy)
onBeforeUnmount(() => {
  dashboardStore.clearStatistics();
});
</script>

<style scoped>

</style>
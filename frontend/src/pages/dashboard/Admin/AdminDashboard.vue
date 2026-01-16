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
            <EventCalendar @addEvent="handleAddEventFromCalendar" />
            <Announcements />
          </a-space>
        </a-col>
      </a-row>
    </a-spin>
  </div>
  <a-drawer
      v-model:open="isFormOpen"
      :title="'Yangi voqea qo\'shish'"
      width="500px"
      destroy-on-close
      @close="closeForm"
    >
      <EventForm
        :mode="'create'"
        :loading="false"
        :event="null"
        @submit="handleFormSubmit"
        @cancel="closeForm"
      />
    </a-drawer>
</template>

<script setup>
// ============================================
// IMPORTS
// ============================================

// Vue Core
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

// UI Components - Cards
import UserCard from '@/components/ui/cards/UserCard.vue';

// UI Components - Charts
import CountChart from '@/components/ui/charts/CountChart.vue';
import AttendanceChart from '@/components/ui/charts/AttendanceChart.vue';
import FinanceChart from '@/components/ui/charts/FinanceChart.vue';

// UI Components - Calendar & Announcements
import EventCalendar from '@/components/ui/calendars/EventCalendar.vue';
import Announcements from '@/components/ui/Announcements.vue';

// Form Components
import EventForm from './events/components/EventForm.vue';

// Stores
import { useDashboardStore } from '@/store/dashboard/dashboard.pinia';

// ============================================
// STORE INITIALIZATION
// ============================================

const dashboardStore = useDashboardStore();

// ============================================
// REACTIVE STATE
// ============================================

const isFormOpen = ref(false);

// ============================================
// COMPUTED PROPERTIES
// ============================================

const loading = computed(() => dashboardStore.isLoading);

const userCounts = computed(() => ({
  admin: dashboardStore.getUserCount('admin'),
  student: dashboardStore.getUserCount('student'),
  teacher: dashboardStore.getUserCount('teacher'),
  parent: dashboardStore.getUserCount('parent'),
}));

// ============================================
// METHODS
// ============================================

/**
 * Calendar'dan voqea qo'shish tugmasi bosilganda chaqiriladi
 */
const handleAddEventFromCalendar = () => {
  isFormOpen.value = true;
};

/**
 * Event form submit bo'lganda chaqiriladi
 * @param {Object} event - Yaratilgan event obyekti
 */
const handleFormSubmit = (event) => {
  // Event yaratish logikasi
  console.log('Event yaratildi:', values);
  closeForm();
};

/**
 * Event form'ni yopish
 */
const closeForm = () => {
  isFormOpen.value = false;
};

// ============================================
// LIFECYCLE HOOKS
// ============================================

/**
 * Component mount bo'lganda statistikalarni yuklash
 */
onMounted(async () => {
  await Promise.all([
    dashboardStore.fetchStatistics(),
    dashboardStore.fetchStudentsCountStatistics()
  ]);
});

/**
 * Component unmount bo'lganda store'ni tozalash
 */
onBeforeUnmount(() => {
  dashboardStore.clearStatistics();
});
</script>

<style scoped>

</style>
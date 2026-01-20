<template>
  <div class="p-4 flex gap-4 flex-col xl:flex-row min-h-[calc(100vh-100px)]">
    <!-- Left - Big Calendar -->
    <div class="w-full xl:w-2/3 h-full">
      <BigCalendar class="h-full" />
    </div>

    <!-- Right - Event Calendar and Announcements -->
    <div class="w-full xl:w-1/3 flex flex-col gap-8">
      <EventCalendar />
      <Announcements />
    </div>
  </div>
</template>

<script setup>
/**
 * Student Dashboard
 * 
 * Clean Architecture tamoyillari:
 * - Separation of Concerns: UI faqat layout va komponentlarni boshqaradi
 * - Single Responsibility: Har bir komponent o'z vazifasini bajaradi
 * - Dependency Injection: BigCalendar o'z-o'zidan role'ni aniqlaydi
 * 
 * BigCalendar komponenti avtomatik ravishda:
 * - Auth store'dan role'ni o'qiydi
 * - Student role bo'lsa, useStudentSchedule composable'ni ishlatadi
 * - Teacher role bo'lsa, useTeacherSchedule composable'ni ishlatadi
 */

import Announcements from '@/components/ui/Announcements.vue';
import EventCalendar from '@/components/ui/calendars/EventCalendar.vue';
import BigCalendar from '@/components/ui/calendars/BigCalendar.vue';
</script>

<style scoped>
/* Student dashboard uchun qo'shimcha stillar kerak bo'lsa qo'shish mumkin */
</style>
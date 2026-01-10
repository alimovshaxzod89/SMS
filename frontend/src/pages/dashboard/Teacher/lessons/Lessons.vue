<template>
    <div class="p-4">
      <!-- Lessons List -->
      <a-card>
        <LessonsList
          :permissions="lessonPermissions"
          role="TEACHER"
        />
      </a-card>
    </div>
  </template>
  
  <script setup>
  import LessonsList from '@/components/shared/lists/LessonsList.vue';
  
  // Permissions for Lesson
  const lessonPermissions = {
    canEdit: false,
    canDelete: false,
    canView: true,
  };
  
  </script>
  
  <style scoped>
  </style>
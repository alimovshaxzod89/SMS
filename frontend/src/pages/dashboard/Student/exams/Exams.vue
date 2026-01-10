<template>
    <div class="p-4">
      <!-- Exams List -->
      <a-card>
        <ExamsList
          :permissions="examPermissions"
          role="STUDENT"
        />
      </a-card>
    </div>
  </template>
  
  <script setup>
  import ExamsList from '@/components/shared/lists/ExamsList.vue';
  
  // Permissions for Exam
  const examPermissions = {
    canEdit: false,
    canDelete: false,
    canView: true,
  };
  
  </script>
  
  <style scoped>
  </style>

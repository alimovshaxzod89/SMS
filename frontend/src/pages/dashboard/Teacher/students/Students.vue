<template>
    <div class="p-4">
      <!-- Students List -->
      <a-card>
        <StudentsList
          :permissions="studentPermissions"
          role="TEACHER"
        />
      </a-card>
    </div>
  </template>
  
  <script setup>
  import StudentsList from '@/components/shared/lists/StudentList.vue';
  
  // Permissions for Student
  const studentPermissions = {
    canEdit: false,
    canDelete: false,
    canView: true,
  };
  
  </script>
  
  <style scoped>
  </style>
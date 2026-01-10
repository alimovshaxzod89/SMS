<template>
    <div class="p-4">
      <!-- Classes List -->
      <a-card>
        <ClassesList
          :permissions="classPermissions"
          role="TEACHER"
        />
      </a-card>
    </div>
  </template>
  
  <script setup>
  import ClassesList from '@/components/shared/lists/ClassesList.vue';
  
  // Permissions for Class
  const classPermissions = {
    canEdit: false,
    canDelete: false,
    canView: true,
  };
  
  </script>
  
  <style scoped>
  </style>
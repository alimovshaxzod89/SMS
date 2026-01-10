<template>
    <div class="p-4">
      <!-- Parents List -->
      <a-card>
        <ParentsList
          :permissions="parentPermissions"
          role="TEACHER"
        />
      </a-card>
    </div>
  </template>
  
  <script setup>
  import ParentsList from '@/components/shared/lists/ParentsList.vue';
  
  // Permissions for Parent
  const parentPermissions = {
    canEdit: false,
    canDelete: false,
    canView: true,
  };
  
  </script>
  
  <style scoped>
  </style>
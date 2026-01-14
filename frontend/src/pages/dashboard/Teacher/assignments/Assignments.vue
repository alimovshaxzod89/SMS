<template>
    <div class="p-4">
      <!-- Assignments List -->
      <a-card>
        <AssignmentsList
          :permissions="assignmentPermissions"
          role="TEACHER"
        />
      </a-card>
    </div>
  </template>
  
  <script setup>
  import AssignmentsList from '@/components/shared/lists/AssignmentsList.vue';
  
  // Permissions for Assignment
  const assignmentPermissions = {
    canEdit: true,
    canDelete: true,
    canView: false,
  };
  
  </script>
  
  <style scoped>
  </style>
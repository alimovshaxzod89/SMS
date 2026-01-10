<template>
    <div class="p-4">
      <!-- Assignments List -->
      <a-card>
        <AssignmentsList
          :permissions="assignmentPermissions"
          role="STUDENT"
        />
      </a-card>
    </div>
  </template>
  
  <script setup>
  import AssignmentsList from '@/components/shared/lists/AssignmentsList.vue';
  
  // Permissions for Assignment
  const assignmentPermissions = {
    canEdit: false,
    canDelete: false,
    canView: true,
  };
  
  </script>
  
  <style scoped>
  </style>

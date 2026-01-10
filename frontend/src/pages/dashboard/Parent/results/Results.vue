<template>
    <div class="p-4">
      <!-- Results List -->
      <a-card>
        <ResultsList
          :permissions="resultPermissions"
          role="PARENT"
        />
      </a-card>
    </div>
  </template>
  
  <script setup>
  import ResultsList from '@/components/shared/lists/ResultsList.vue';
  
  // Permissions for Result
  const resultPermissions = {
    canEdit: false,
    canDelete: false,
    canView: true,
  };
  
  </script>
  
  <style scoped>
  </style>

<template>
    <div class="p-4">
      <!-- Events List -->
      <a-card>
        <EventsList
          :permissions="eventPermissions"
          role="TEACHER"
        />
      </a-card>
    </div>
  </template>
  
  <script setup>
  import EventsList from '@/components/shared/lists/EventsList.vue';
  
  // Permissions for Event
  const eventPermissions = {
    canEdit: true,
    canDelete: true,
    canView: true,
  };
  
  </script>
  
  <style scoped>
  </style>
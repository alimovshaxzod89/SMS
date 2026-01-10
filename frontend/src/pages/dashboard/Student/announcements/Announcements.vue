<template>
    <div class="p-4">
      <!-- Announcements List -->
      <a-card>
        <AnnouncementsList
          :permissions="announcementPermissions"
          role="STUDENT"
        />
      </a-card>
    </div>
  </template>
  
  <script setup>
  import AnnouncementsList from '@/components/shared/lists/AnnouncementsList.vue';
  
  // Permissions for Announcement
  const announcementPermissions = {
    canEdit: false,
    canDelete: false,
    canView: true,
  };
  
  </script>
  
  <style scoped>
  </style>

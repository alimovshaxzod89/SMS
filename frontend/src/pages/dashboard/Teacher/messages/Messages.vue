<template>
    <div class="p-4">
      <!-- Messages List -->
      <a-card>
        <!-- <MessagesList
          :permissions="messagePermissions"
          role="TEACHER"
        /> -->
        <h2>Messages</h2>
      </a-card>
    </div>
  </template>
  
  <script setup>
//   import MessagesList from '@/components/shared/lists/';
  
  // Permissions for Message
  const messagePermissions = {
    canEdit: false,
    canDelete: false,
    canView: true,
  };
  
  </script>
  
  <style scoped>
  </style>
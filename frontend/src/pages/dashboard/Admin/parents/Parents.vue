<template>
    <div class="p-4">
      <!-- Parents List -->
      <a-card>
        <ParentsList
          :permissions="adminPermissions"
          role="ADMIN"
          @addParent="openAddForm"
          @editParent="openEditForm"
          @deleteParent="openDeleteForm"
        />
      </a-card>
    </div>

    <a-drawer
      v-model:open="isFormOpen"
      :title="formMode === 'create' ? 'Add Parent' : 'Edit Parent'"
      width="500px"
      destroy-on-close
      @close="closeForm"
    >
      <ParentForm 
        :mode="formMode"
        :loading="false"
        :parent="selectedParent"
        @submit="handleFormSubmit"
        @cancel="closeForm"
      />
    </a-drawer>
</template>
  
<script setup>
import ParentsList from '@/components/shared/lists/ParentsList.vue';
import ParentForm from './components/ParentForm.vue';
import { ref } from 'vue';
  
  // Permissions for Admin
  const adminPermissions = {
    canEdit: true,
    canDelete: true,
    canView: true,
  };
  const isFormOpen = ref(false);
  const formMode = ref('create');
  const selectedParent = ref(null);

  const openAddForm = () => {
    isFormOpen.value = true;
    formMode.value = 'create';
    selectedParent.value = null;
  }

  const openEditForm = (parent) => {
    selectedParent.value = { ...parent };
    formMode.value = 'edit';
    isFormOpen.value = true;
  }

  const openDeleteForm = (record) => {
    console.log('DELETE TEMPLATE, record:', record)
  }
  
  const closeForm = () => {
    selectedParent.value = null;
    formMode.value = 'create';
    isFormOpen.value = false;
  }

  const handleFormSubmit = (values) => {
    if (formMode.value === 'create') {
      console.log('CREATE TEMPLATE, values:', values)
      // keyin: parentsStore.createParent(values)
    } else {
      console.log('EDIT TEMPLATE, id:', selectedParent.value?.id, 'values:', values)
      // keyin: parentsStore.updateParent(selectedParent.value.id, values)
    }
    isFormOpen.value = false
  }
  
</script>
  
<style scoped>
</style>
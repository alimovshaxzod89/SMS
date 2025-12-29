<template>
  <div class="p-4">
    <!-- Classes List -->
    <a-card>
      <ClassesList
        :permissions="adminPermissions"
        role="ADMIN"
        @addClass="openAddForm"
        @editClass="openEditForm"
        @deleteClass="openDeleteForm"
      />
    </a-card>
  </div>

  <a-drawer
    v-model:open="isFormOpen"
    :title="formMode === 'create' ? 'Add Class' : 'Edit Class'"
    width="500px"
    destroy-on-close
    @close="closeForm"
  >
    <ClassForm 
      :mode="formMode"
      :loading="false"
      :classData="selectedClass"
      @submit="handleFormSubmit"
      @cancel="closeForm"
    />
  </a-drawer>
</template>
  
<script setup>
  import ClassesList from '@/components/shared/lists/ClassesList.vue';
  import { ref } from 'vue';
  import ClassForm from './components/ClassForm.vue';
  
  // Permissions for Admin
  const adminPermissions = {
    canEdit: true,
    canDelete: true,
    canView: true,
  };
  
  const isFormOpen = ref(false);
  const formMode = ref('create');
  const selectedClass = ref(null);
  
  const openAddForm = () => {
    formMode.value = 'create';
    selectedClass.value = null;
    isFormOpen.value = true;
  }

  const openEditForm = (classData) => {
    selectedClass.value = { ...classData };
    formMode.value = 'edit';
    isFormOpen.value = true;
  }

  const closeForm = () => {
    selectedClass.value = null;
    formMode.value = 'create';
    isFormOpen.value = false;
  }

  const openDeleteForm = (record) => {
    console.log('DELETE TEMPLATE, record:', record)
    // keyinchalik bu yerga store.deleteClass(record.id) qo'shamiz
  }

  const handleFormSubmit = (values) => {
    if (formMode.value === 'create') {
      console.log('CREATE TEMPLATE, values:', values)
      // keyin: classesStore.createClass(values)
    } else {
      console.log('EDIT TEMPLATE, id:', selectedClass.value?._id || selectedClass.value?.id, 'values:', values)
      // keyin: classesStore.updateClass(selectedClass.value._id || selectedClass.value.id, values)
    }
    isFormOpen.value = false
  }
  
</script>
  
<style scoped>
</style>
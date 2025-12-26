<template>
  <div class="p-4">
    <!-- Teachers List -->
    <a-card>
      <TeachersList
        :permissions="adminPermissions"
        role="ADMIN"
        @addTeacher="openAddForm"
        @editTeacher="openEditForm"
        @deleteTeacher="openDeleteForm"
      />
    </a-card>
  </div>

  <a-drawer
    v-model:open="isFormOpen"
    :title="formMode === 'create' ? 'Add Teacher' : 'Edit Teacher'"
    width="500px"
    destroy-on-close
    @close="closeForm"
  >
    <TeacherForm 
      :mode="formMode"
      :loading="false"
      :teacher="selectedTeacher"
      @submit="handleFormSubmit"
      @cancel="closeForm"
    />
  </a-drawer>
</template>
  
<script setup>
  import TeachersList from '@/components/shared/lists/TeachersList.vue';
  import { ref } from 'vue';
import TeacherForm from './components/TeacherForm.vue';
  // Permissions for Admin
  const adminPermissions = {
    canEdit: true,
    canDelete: true,
    canView: true,
  };
  const isFormOpen = ref(false);
  const formMode = ref('create');
  const selectedTeacher = ref(null);
  
  const openAddForm = () => {
    formMode.value = 'create';
    selectedTeacher.value = null;
    isFormOpen.value = true;
  }

  const openEditForm = (teacher) =>{
    selectedTeacher.value = { ...teacher };
    formMode.value = 'edit';
    isFormOpen.value = true;
  }

  const closeForm = () => {
    selectedTeacher.value = null;
    formMode.value = 'create';
    isFormOpen.value = false;
  }

  const openDeleteForm = (record) => {
    console.log('DELETE TEMPLATE, record:', record)
    // keyinchalik bu yerga store.deleteTeacher(record.id) qo‘shamiz
  }

  const handleFormSubmit = (values) => {
    if (formMode.value === 'create') {
      console.log('CREATE TEMPLATE, values:', values)
      // keyin: teachersStore.createTeacher(values)
    } else {
      console.log('EDIT TEMPLATE, id:', selectedTeacher.value?.id, 'values:', values)
      // keyin: teachersStore.updateTeacher(selectedTeacher.value.id, values)
    }
    isFormOpen.value = false
  }
  
</script>
  
<style scoped>
</style>
<template>
  <div class="p-4">
    <!-- Assignments List -->
    <a-card>
      <AssignmentsList 
        :permissions="adminPermissions" 
        role="ADMIN" 
        @addAssignment="openAddForm"
        @editAssignment="openEditForm"
        @deleteAssignment="openDeleteForm"
      />
    </a-card>
  </div>
  <a-drawer
    v-model:open="isFormOpen"
    :title="formMode === 'create' ? 'Add Assignment' : 'Edit Assignment'"
    width="500px"
    destroy-on-close
    @close="closeForm"
  >
    <AssignmentForm 
      :mode="formMode"
      :loading="false"
      :assignment="selectedAssignment"
      @submit="handleFormSubmit"
      @cancel="closeForm"
    />
  </a-drawer>
</template>

<script setup>
// 1. Imports - Vue core
import { ref } from 'vue';
// 2. Imports - Components
import AssignmentsList from '@/components/shared/lists/AssignmentsList.vue';
import AssignmentForm from './components/AssignmentForm.vue';

// 3. Constants
// Permissions for Admin
const adminPermissions = {
  canEdit: true,
  canDelete: true,
  canView: true,
};

// 4. Reactive State
const isFormOpen = ref(false);
const formMode = ref('create');
const selectedAssignment = ref(null);

// 5. Methods
/**
 * Yangi topshiriq qo'shish formini ochish
 */
const openAddForm = () => {
  formMode.value = 'create';
  selectedAssignment.value = null;
  isFormOpen.value = true;
};

/**
 * Topshiriqni tahrirlash formini ochish
 * @param {Object} assignment - Tahrirlash kerak bo'lgan topshiriq ma'lumotlari
 */
const openEditForm = (assignment) => {
  selectedAssignment.value = { ...assignment };
  formMode.value = 'edit';
  isFormOpen.value = true;
};

/**
 * Formani yopish va state'ni tozalash
 */
const closeForm = () => {
  selectedAssignment.value = null;
  formMode.value = 'create';
  isFormOpen.value = false;
};

/**
 * Topshiriqni o'chirish
 * @param {Object} record - O'chirish kerak bo'lgan topshiriq ma'lumotlari
 */
const openDeleteForm = (record) => {
  // TODO: keyinchalik bu yerga assignmentsStore.deleteAssignment(record.id) qo'shamiz
  console.log('DELETE TEMPLATE, record:', record);
};

/**
 * Form submit qilinganda ishlaydi
 * @param {Object} values - Form ma'lumotlari
 */
const handleFormSubmit = (values) => {
  if (formMode.value === 'create') {
    // TODO: keyin: assignmentsStore.createAssignment(values)
    console.log('CREATE TEMPLATE, values:', values);
  } else {
    // TODO: keyin: assignmentsStore.updateAssignment(selectedAssignment.value.id, values)
    console.log('EDIT TEMPLATE, id:', selectedAssignment.value?.id, 'values:', values);
  }
  closeForm();
};
</script>

<style scoped></style>

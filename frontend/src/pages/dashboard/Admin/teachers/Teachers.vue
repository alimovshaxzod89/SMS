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
// 1. Imports - Vue core
import { ref } from 'vue';
// 2. Imports - Components
import TeachersList from '@/components/shared/lists/TeachersList.vue';
import TeacherForm from './components/TeacherForm.vue';

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
const selectedTeacher = ref(null);

// 5. Methods
/**
 * Yangi o'qituvchi qo'shish formini ochish
 */
const openAddForm = () => {
  formMode.value = 'create';
  selectedTeacher.value = null;
  isFormOpen.value = true;
};

/**
 * O'qituvchini tahrirlash formini ochish
 * @param {Object} teacher - Tahrirlash kerak bo'lgan o'qituvchi ma'lumotlari
 */
const openEditForm = (teacher) => {
  selectedTeacher.value = { ...teacher };
  formMode.value = 'edit';
  isFormOpen.value = true;
};

/**
 * Formani yopish va state'ni tozalash
 */
const closeForm = () => {
  selectedTeacher.value = null;
  formMode.value = 'create';
  isFormOpen.value = false;
};

/**
 * O'qituvchini o'chirish
 * @param {Object} record - O'chirish kerak bo'lgan o'qituvchi ma'lumotlari
 */
const openDeleteForm = (record) => {
  // TODO: keyinchalik bu yerga store.deleteTeacher(record.id) qo'shamiz
  console.log('DELETE TEMPLATE, record:', record);
};

/**
 * Form submit qilinganda ishlaydi
 * @param {Object} values - Form ma'lumotlari
 */
const handleFormSubmit = (values) => {
  if (formMode.value === 'create') {
    // TODO: keyin: teachersStore.createTeacher(values)
    console.log('CREATE TEMPLATE, values:', values);
  } else {
    // TODO: keyin: teachersStore.updateTeacher(selectedTeacher.value.id, values)
    console.log('EDIT TEMPLATE, id:', selectedTeacher.value?.id, 'values:', values);
  }
  closeForm();
};
</script>
  
<style scoped>
</style>
<template>
  <div class="p-4">
    <!-- Exams List -->
    <a-card>
      <ExamsList
        :permissions="adminPermissions"
        role="ADMIN"
        @addExam="openAddForm"
        @editExam="openEditForm"
        @deleteExam="openDeleteForm"
      />
    </a-card>
  </div>

  <a-drawer
    v-model:open="isFormOpen"
    :title="formMode === 'create' ? 'Add Exam' : 'Edit Exam'"
    width="500px"
    destroy-on-close
    @close="closeForm"
  >
    <ExamForm
      :mode="formMode"
      :loading="false"
      :exam="selectedExam"
      @submit="handleFormSubmit"
      @cancel="closeForm"
    />
  </a-drawer>
</template>

<script setup>
// 1. Imports - Vue core
import { ref } from 'vue';
// 2. Imports - Components
import ExamsList from '@/components/shared/lists/ExamsList.vue';
import ExamForm from './components/ExamForm.vue';

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
const selectedExam = ref(null);

// 5. Methods
/**
 * Yangi imtihon qo'shish formini ochish
 */
const openAddForm = () => {
  formMode.value = 'create';
  selectedExam.value = null;
  isFormOpen.value = true;
};

/**
 * Imtihonni tahrirlash formini ochish
 * @param {Object} exam - Tahrirlash kerak bo'lgan imtihon ma'lumotlari
 */
const openEditForm = (exam) => {
  selectedExam.value = { ...exam };
  formMode.value = 'edit';
  isFormOpen.value = true;
};

/**
 * Formani yopish va state'ni tozalash
 */
const closeForm = () => {
  selectedExam.value = null;
  formMode.value = 'create';
  isFormOpen.value = false;
};

/**
 * Imtihonni o'chirish
 * @param {Object} record - O'chirish kerak bo'lgan imtihon ma'lumotlari
 */
const openDeleteForm = (record) => {
  // TODO: keyinchalik bu yerga store.deleteExam(record.id) qo'shamiz
  console.log('DELETE TEMPLATE, record:', record);
};

/**
 * Form submit qilinganda ishlaydi
 * @param {Object} values - Form ma'lumotlari
 */
const handleFormSubmit = (values) => {
  if (formMode.value === 'create') {
    // TODO: keyin: examsStore.createExam(values)
    console.log('CREATE TEMPLATE, values:', values);
  } else {
    // TODO: keyin: examsStore.updateExam(selectedExam.value.id, values)
    console.log('EDIT TEMPLATE, id:', selectedExam.value?.id, 'values:', values);
  }
  closeForm();
};
</script>

<style scoped></style>

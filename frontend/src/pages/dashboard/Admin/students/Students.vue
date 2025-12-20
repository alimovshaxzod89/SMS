<template>
    <div class="p-4">
        <!-- Student List -->
        <a-card>
            <StudentList 
                :permissions="adminPermissions" 
                role="ADMIN" 
                @addStudent="openAddForm"
                @editStudent="openEditForm"
                @deleteStudent="openDeleteForm"
            />
        </a-card>
    </div>
    <a-drawer
      v-model:open="isFormOpen"
      :title="formMode === 'create' ? 'Add Student' : 'Edit Student'"
      width="500px"
      destroy-on-close
      @close="closeForm"
    >
      <StudentForm 
        :mode="formMode"
        :loading="false"
        :student="selectedStudent"
        @submit="handleFormSubmit"
        @cancel="closeForm"
      />
    </a-drawer>
</template>

<script setup>
import StudentList from '@/components/shared/lists/StudentList.vue';
import StudentForm from './components/StudentForm.vue';
import { ref } from 'vue';

// Permissions for Admin
const adminPermissions = {
    canEdit: true,
    canDelete: true,
    canView: true,
};

const isFormOpen = ref(false);
const formMode = ref('create');
const selectedStudent = ref(null);

const openAddForm = () => {
    isFormOpen.value = true;
    formMode.value = 'create';
    selectedStudent.value = null;
}
const openEditForm = (student) => {
    isFormOpen.value = true;
    formMode.value = 'edit';
    selectedStudent.value = {...student};
}
const openDeleteForm = (student) => {
    console.log('DELETE TEMPLATE, student:', student)
    // keyinchalik bu yerga store.deleteStudent(record.id) qo‘shamiz
}
const closeForm = () => {
    selectedStudent.value = null;
    formMode.value = 'create';
    isFormOpen.value = false;
}
const handleFormSubmit = (values) => {
  if (formMode.value === 'create') {
    console.log('CREATE TEMPLATE, values:', values)
    // keyin: studentsStore.createStudent(values)
  } else {
    console.log('EDIT TEMPLATE, id:', selectedStudent.value?.id, 'values:', values)
    // keyin: studentsStore.updateStudent(selectedStudent.value.id, values)
  }
  closeForm();
}
</script>

<style scoped></style>
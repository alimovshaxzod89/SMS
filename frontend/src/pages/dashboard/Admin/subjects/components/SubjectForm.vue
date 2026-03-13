<template>
  <div class="p-2">
    <a-form :ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item label="Fan nomi" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item label="O'qituvchilar" name="teachers">
        <a-select
          v-model:value="formState.teachers"
          mode="multiple"
          :loading="teachersLoading"
        >
          <a-select-option
            v-for="teacher in teachers"
            :key="teacher._id || teacher.id"
            :value="teacher._id || teacher.id"
          >
            {{ `${teacher.name || ''} ${teacher.surname || ''}`.trim() }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <div class="flex justify-end gap-2">
        <a-button @click="emit('cancel')" :disabled="loading">
          Bekor qilish
        </a-button>
        <a-button
          class="bg-blue-600 text-white hover:bg-blue-700"
          type="primary"
          @click="handleSubmit"
          :disabled="loading"
        >
          {{ mode === 'create' ? 'Yaratish' : 'Saqlash' }}
        </a-button>
      </div>
    </a-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFormValidation } from '@/composables/useFormValidation';
import { SubjectSchema } from '@/utils/validation';
import { getTeachers } from '@/services/modules/teachers/teachers.service';

// Props
const props = defineProps({
  mode: {
    type: String,
    default: 'create',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  subject: {
    type: Object,
    default: () => null,
  },
});

// Emits
const emit = defineEmits(['cancel', 'submit']);

// Form validatsiya - composable orqali
const { formRef, formState, rules, createSubmitHandler, setupWatchers } =
  useFormValidation({
    schema: SubjectSchema.schema,
    initialState: SubjectSchema.initialState,
    mapToFormState: SubjectSchema.mapToFormState,
  });

// Watchers setup
setupWatchers(() => props, { dataKey: 'subject', modeKey: 'mode' });

// Submit handler
const handleSubmit = createSubmitHandler((data) => {
  emit('submit', data);
});

// O'qituvchilar ro'yxati
const teachers = ref([]);
const teachersLoading = ref(false);

const loadTeachers = async () => {
  if (teachers.value.length > 0) return;

  teachersLoading.value = true;
  try {
    const result = await getTeachers({ page: 1, limit: 100 });
    if (result.success) {
      teachers.value = result.data;
    }
  } catch (error) {
    console.error("O'qituvchilarni yuklashda xatolik:", error);
    teachers.value = [];
  } finally {
    teachersLoading.value = false;
  }
};

onMounted(() => {
  loadTeachers();
});
</script>

<style scoped></style>

<template>
  <div class="p-2">
    <a-form :ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item
        label="Ball"
        name="score"
      >
        <a-input-number
          v-model:value="formState.score"
          :min="0"
          :max="100"
          class="w-[100%]"
        />
      </a-form-item>
      <a-form-item
        label="O'quvchi"
        name="studentId"
      >
        <a-select
          v-model:value="formState.studentId"
          :loading="loadingStudents"
          placeholder="O'quvchini tanlang"
          allow-clear
        >
          <a-select-option
            v-for="student in students"
            :key="student._id"
            :value="student._id"
          >
            {{ student.name }} {{ student.surname }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="Imtihon"
        name="examId"
      >
        <a-select
          v-model:value="formState.examId"
          :loading="loadingExams"
          placeholder="Imtihonni tanlang"
          allow-clear
        >
          <a-select-option
            v-for="exam in exams"
            :key="exam._id"
            :value="exam._id"
          >
            {{ exam.title }}
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
          {{ mode === "create" ? "Yaratish" : "Saqlash" }}
        </a-button>
      </div>
    </a-form>
  </div>
</template>
<script setup>
// 1. Imports - Vue core
import { onMounted, ref } from "vue";

// 2. Imports - Composables & Validation
import { useFormValidation } from "@/composables/useFormValidation";
import { ResultSchema } from "@/utils/validation";

// 3. Imports - Services
import { getStudents } from "@/services/modules/students/students.service";
import { getExams } from "@/services/modules/exams/exams.service";

// 4. Props
const props = defineProps({
  mode: {
    type: String,
    default: "create",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  result: {
    type: Object,
    default: () => ({}),
  },
});

// 5. Emits
const emit = defineEmits(["cancel", "submit"]);

// 6. Form validation composable
const { formRef, formState, rules, createSubmitHandler, setupWatchers } =
  useFormValidation({
    schema: ResultSchema.schema,
    initialState: ResultSchema.initialState,
    mapToFormState: ResultSchema.mapToFormState,
  });

setupWatchers(() => props, { dataKey: "result", modeKey: "mode" });

// 7. Reactive State
const students = ref([]);
const loadingStudents = ref(false);
const exams = ref([]);
const loadingExams = ref(false);

// 8. Methods
/**
 * O'quvchilarni yuklash
 */
const loadStudents = async () => {
  if (students.value.length === 0) {
    loadingStudents.value = true;
    try {
      const result = await getStudents({
        page: 1,
        limit: 100,
      });

      if (result.success) {
        students.value = result.data;
      }
    } catch (error) {
      console.error("O'quvchilarni yuklashda xatolik:", error);
      students.value = [];
    } finally {
      loadingStudents.value = false;
    }
  }
};

/**
 * Imtihonlarni yuklash
 */
const loadExams = async () => {
  if (exams.value.length === 0) {
    loadingExams.value = true;
    try {
      const result = await getExams({
        page: 1,
        limit: 100,
      });

      if (result.success) {
        exams.value = result.data;
      }
    } catch (error) {
      console.error("Imtihonlarni yuklashda xatolik:", error);
      exams.value = [];
    } finally {
      loadingExams.value = false;
    }
  }
};

/**
 * Form submit qilish
 */
const handleSubmit = createSubmitHandler((data) => {
  emit("submit", data);
});

// 9. Lifecycle Hooks
onMounted(() => {
  loadStudents();
  loadExams();
});
</script>
<style scoped></style>

<template>
  <div class="p-2">
    <a-form :ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item
        label="Imtihon nomi"
        name="title"
      >
        <a-input v-model:value="formState.title" />
      </a-form-item>
      <div class="flex gap-2">
        <a-form-item
          label="Boshlanish vaqti"
          name="startTime"
          class="w-[100%]"
        >
          <a-date-picker class="w-[100%]" v-model:value="formState.startTime" />
        </a-form-item>
        <a-form-item
          label="Tugash vaqti"
          name="endTime"
          class="w-[100%]"
        >
          <a-date-picker class="w-[100%]" v-model:value="formState.endTime" />
        </a-form-item>
      </div>
      <a-form-item
        label="Dars"
        name="lessonId"
      >
        <a-select
          v-model:value="formState.lessonId"
          :loading="loadingLessons"
          placeholder="Lessonni tanlang"
          allow-clear
        >
          <a-select-option
            v-for="lesson in lessons"
            :key="lesson._id"
            :value="lesson._id"
          >
            {{ lesson.name }}
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
// 2. Imports - Utils
import dayjs from "dayjs";
// 3. Imports - Composables & Validation
import { useFormValidation } from "@/composables/useFormValidation";
import { ExamSchema } from "@/utils/validation";
// 4. Imports - Services
import { getLessons } from "@/services/modules/lessons/lessons.service";

// 5. Props
const props = defineProps({
  mode: {
    type: String,
    default: "create",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  exam: {
    type: Object,
    default: () => ({}),
  },
});

// 6. Emits
const emit = defineEmits(["cancel", "submit"]);

// 7. Form validation composable
const { formRef, formState, rules, createSubmitHandler, setupWatchers } =
  useFormValidation({
    schema: ExamSchema.schema,
    initialState: ExamSchema.initialState,
    mapToFormState: ExamSchema.mapToFormState,
  });

setupWatchers(() => props, { dataKey: "exam", modeKey: "mode" });

// 8. Reactive State
const lessons = ref([]);
const loadingLessons = ref(false);

// 9. Methods
/**
 * Lessonlarni yuklash
 */
const loadLessons = async () => {
  if (lessons.value.length === 0) {
    loadingLessons.value = true;
    try {
      const result = await getLessons({
        page: 1,
        limit: 100,
      });

      if (result.success) {
        lessons.value = result.data;
      }
    } catch (error) {
      console.error("Lessonlarni yuklashda xatolik:", error);
      lessons.value = [];
    } finally {
      loadingLessons.value = false;
    }
  }
};

/**
 * Form submit qilish
 */
const handleSubmit = createSubmitHandler((data) => {
  emit("submit", {
    ...data,
    startTime: data.startTime ? dayjs(data.startTime).toISOString() : null,
    endTime: data.endTime ? dayjs(data.endTime).toISOString() : null,
  });
});

// 10. Lifecycle Hooks
onMounted(() => {
  loadLessons();
});
</script>
<style scoped></style>

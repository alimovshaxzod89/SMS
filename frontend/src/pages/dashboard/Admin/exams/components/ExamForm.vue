<template>
  <div class="p-2">
    <a-form ref="formRef" :model="formState" layout="vertical">
      <a-form-item
        label="Title"
        name="title"
        :rules="[{ required: true, message: 'Please input exam title' }]"
      >
        <a-input v-model:value="formState.title" />
      </a-form-item>
      <div class="flex gap-2">
        <a-form-item
          label="Start Time"
          name="startTime"
          class="w-[100%]"
          :rules="[{ required: true, message: 'Please input exam start time' }]"
        >
          <a-date-picker class="w-[100%]" v-model:value="formState.startTime" />
        </a-form-item>
        <a-form-item
          label="End Time"
          name="endTime"
          class="w-[100%]"
          :rules="[{ required: true, message: 'Please input exam end time' }]"
        >
          <a-date-picker class="w-[100%]" v-model:value="formState.endTime" />
        </a-form-item>
      </div>
      <a-form-item
        label="Lesson"
        name="lessonId"
        :rules="[{ required: true, message: 'Please select a lesson' }]"
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
import { onMounted, ref, watch } from "vue";
// 2. Imports - Utils
import dayjs from "dayjs";
// 3. Imports - Services
import { getLessons } from "@/services/modules/lessons/lessons.service";

// 3. Props
const props = defineProps({
  mode: {
    type: String,
    default: "create", // create or edit
  },
  loading: {
    type: Boolean,
    default: false,
  },
  exam: {
    type: Object,
    default: () => ({
      title: "",
      startTime: "",
      endTime: "",
      lessonId: "",
    }),
  },
});

// 4. Emits
const emit = defineEmits(["cancel", "submit"]);

// 5. Reactive State
const formRef = ref(null);
const formState = ref({
  title: "",
  startTime: "",
  endTime: "",
  lessonId: "",
});

const lessons = ref([]);
const loadingLessons = ref(false);

// 6. Methods
/**
 * Formani tozalash
 */
const resetForm = () => {
  formState.value = {
    title: "",
    startTime: "",
    endTime: "",
    lessonId: "",
  };
  formRef.value?.resetFields();
};

/**
 * String datani dayjs obyektiga o'girish
 * @param {string|Date|dayjs} date - O'girilishi kerak bo'lgan sana
 * @returns {dayjs|null} - dayjs obyekti yoki null
 */
const parseDate = (date) => {
  if (!date) return null;
  // Agar allaqachon dayjs obyekti bo'lsa
  if (dayjs.isDayjs(date)) return date;
  // String yoki Date bo'lsa, dayjs ga o'girish
  return dayjs(date);
};

/**
 * Formani exam ma'lumotlari bilan to'ldirish
 * @param {Object} exam - Imtihon ma'lumotlari
 */
const populateForm = (exam) => {
  if (exam && Object.keys(exam).length > 0) {
    // lessonId obyekt bo'lsa, uning _id sini olish
    const lessonId = 
      typeof exam.lessonId === 'object' && exam.lessonId !== null
        ? exam.lessonId._id || exam.lessonId.id
        : exam.lessonId || "";
    
    formState.value = {
      title: exam.title || "",
      startTime: parseDate(exam.startTime),
      endTime: parseDate(exam.endTime),
      lessonId: lessonId,
    };
  } else {
    resetForm();
  }
};

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
const handleSubmit = () => {
  formRef.value
    ?.validate()
    .then(() => {
      // dayjs obyektlarini ISO string formatiga o'girish
      const submitData = {
        ...formState.value,
        startTime: formState.value.startTime
          ? dayjs(formState.value.startTime).toISOString()
          : null,
        endTime: formState.value.endTime
          ? dayjs(formState.value.endTime).toISOString()
          : null,
      };
      emit("submit", submitData);
    })
    .catch((error) => {
      console.error("Form validation error:", error);
    });
};

// 7. Watchers
/**
 * Props o'zgarganda formState ni yangilash
 */
watch(
  () => props.exam,
  (newExam) => {
    populateForm(newExam);
  },
  { immediate: true, deep: true }
);

/**
 * Mode o'zgarganda ham formani tozalash
 */
watch(
  () => props.mode,
  (newMode) => {
    if (newMode === "create") {
      resetForm();
    }
  }
);

// 8. Lifecycle Hooks
onMounted(() => {
  loadLessons();
});
</script>
<style scoped></style>

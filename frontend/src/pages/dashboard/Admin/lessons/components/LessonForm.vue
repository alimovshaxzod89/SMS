<template>
  <div class="p-2">
    <a-form :ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item label="Dars nomi" name="name">
        <a-input v-model:value="formState.name" placeholder="Dars nomini tanlang" />
      </a-form-item>
      <a-form-item label="Fan nomi" name="subjectId">
        <a-select
          v-model:value="formState.subjectId"
          :loading="loadingSubjects"
          placeholder="Subjectni tanlang"
          allow-clear
        >
          <a-select-option
            v-for="subject in subjects"
            :key="subject._id"
            :value="subject._id"
          >
            {{ subject.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Sinf" name="classId">
        <a-select
          v-model:value="formState.classId"
          :loading="loadingClasses"
          placeholder="Sinfni tanlang"
          allow-clear
        >
          <a-select-option
            v-for="classItem in classes"
            :key="classItem._id"
            :value="classItem._id"
          >
            {{ classItem.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="O'qituvchi" name="teacherId">
        <a-select
          v-model:value="formState.teacherId"
          :loading="loadingTeachers"
          placeholder="O'qituvchini tanlang"
          allow-clear
        >
          <a-select-option
            v-for="teacher in teachers"
            :key="teacher._id"
            :value="teacher._id"
          >
            {{ teacher.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Dars kuni" name="day">
        <a-select v-model:value="formState.day" :options="dayOptions" />
      </a-form-item>
      <div class="flex gap-2">
        <a-form-item label="Dars boshlanish vaqtini tanlang" name="startTime" class="w-[100%]">
          <a-time-picker class="w-[100%]" v-model:value="formState.startTime" />
        </a-form-item>
        <a-form-item label="Dars tugash vaqtini tanlang" name="endTime" class="w-[100%]">
          <a-time-picker class="w-[100%]" v-model:value="formState.endTime" />
        </a-form-item>
      </div>
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
import { ref, onMounted } from "vue";
import dayjs from "dayjs";
import { WEEK_DAY_OPTIONS } from "@/utils/constants/weekDays";
import { useFormValidation } from "@/composables/useFormValidation";
import { LessonSchema } from "@/utils/validation";
import { getClasses } from "@/services/modules/classes/classes.service";
import { getSubjects } from "@/services/modules/subjects/subjects.service";
import { getTeachers } from "@/services/modules/teachers/teachers.service";

// Props
const props = defineProps({
  mode: {
    type: String,
    default: "create",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  lesson: {
    type: Object,
    default: () => null,
  },
});

// Emits
const emit = defineEmits(["cancel", "submit"]);

// Form validatsiya - composable orqali
const { formRef, formState, rules, createSubmitHandler, setupWatchers } =
  useFormValidation({
    schema:         LessonSchema.schema,
    initialState:   LessonSchema.initialState,
    mapToFormState: LessonSchema.mapToFormState,
  });

// Watchers setup
setupWatchers(() => props, { dataKey: "lesson", modeKey: "mode" });

// Submit handler - dayjs vaqtlarini ISO stringga o'girish
const handleSubmit = createSubmitHandler((data) => {
  emit("submit", {
    ...data,
    startTime: data.startTime ? dayjs(data.startTime).toISOString() : null,
    endTime:   data.endTime   ? dayjs(data.endTime).toISOString()   : null,
  });
});

// Dropdown options
const dayOptions = WEEK_DAY_OPTIONS;

// Subjects
const subjects = ref([]);
const loadingSubjects = ref(false);

const loadSubjects = async () => {
  if (subjects.value.length > 0) return;
  loadingSubjects.value = true;
  try {
    const result = await getSubjects({ page: 1, limit: 100 });
    if (result.success) subjects.value = result.data;
  } catch (error) {
    console.error("Subjectlarni yuklashda xatolik:", error);
    subjects.value = [];
  } finally {
    loadingSubjects.value = false;
  }
};

// Classes
const classes = ref([]);
const loadingClasses = ref(false);

const loadClasses = async () => {
  if (classes.value.length > 0) return;
  loadingClasses.value = true;
  try {
    const result = await getClasses({ page: 1, limit: 100 });
    if (result.success) classes.value = result.data;
  } catch (error) {
    console.error("Classesni yuklashda xatolik:", error);
    classes.value = [];
  } finally {
    loadingClasses.value = false;
  }
};

// Teachers
const teachers = ref([]);
const loadingTeachers = ref(false);

const loadTeachers = async () => {
  if (teachers.value.length > 0) return;
  loadingTeachers.value = true;
  try {
    const result = await getTeachers({ page: 1, limit: 100 });
    if (result.success) teachers.value = result.data;
  } catch (error) {
    console.error("O'qituvchilarni yuklashda xatolik:", error);
    teachers.value = [];
  } finally {
    loadingTeachers.value = false;
  }
};

onMounted(() => {
  loadSubjects();
  loadClasses();
  loadTeachers();
});
</script>

<style scoped></style>

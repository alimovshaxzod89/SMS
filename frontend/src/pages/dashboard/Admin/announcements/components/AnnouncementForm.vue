<template>
  <div class="p-2">
    <a-form :ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item
        label="Sarlavha"
        name="title"
      >
        <a-input v-model:value="formState.title" />
      </a-form-item>
      <a-form-item
        label="Tavsif"
        name="description"
      >
        <a-textarea v-model:value="formState.description" />
      </a-form-item>
      <a-form-item
        label="Sana"
        name="date"
      >
        <a-date-picker v-model:value="formState.date" class="w-[100%]" />
      </a-form-item>
      <a-form-item
        label="Sinf"
        name="classId"
      >
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

// 2. Imports - Third-party libraries
import dayjs from "dayjs";

// 3. Imports - Composables & Validation
import { useFormValidation } from "@/composables/useFormValidation";
import { AnnouncementSchema } from "@/utils/validation";

// 4. Imports - Services
import { getClasses } from "@/services/modules/classes/classes.service";

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
  announcement: {
    type: Object,
    default: () => ({}),
  },
});

// 6. Emits
const emit = defineEmits(["cancel", "submit"]);

// 7. Form validation composable
const { formRef, formState, rules, createSubmitHandler, setupWatchers } =
  useFormValidation({
    schema: AnnouncementSchema.schema,
    initialState: AnnouncementSchema.initialState,
    mapToFormState: AnnouncementSchema.mapToFormState,
  });

setupWatchers(() => props, { dataKey: "announcement", modeKey: "mode" });

// 8. Reactive State
const classes = ref([]);
const loadingClasses = ref(false);

// 9. Methods
/**
 * Classlar ro'yxatini yuklash
 */
const loadClasses = async () => {
  if (classes.value.length === 0) {
    loadingClasses.value = true;
    try {
      const result = await getClasses({ page: 1, limit: 100 });
      if (result.success) {
        classes.value = result.data;
      }
    } catch (error) {
      console.error("Classlarni yuklashda xatolik:", error);
      classes.value = [];
    } finally {
      loadingClasses.value = false;
    }
  }
};

/**
 * Form submit qilish
 */
const handleSubmit = createSubmitHandler((data) => {
  emit("submit", {
    ...data,
    date: data.date ? dayjs(data.date).toISOString() : null,
  });
});

// 10. Lifecycle Hooks
onMounted(() => {
  loadClasses();
});
</script>
<style scoped></style>

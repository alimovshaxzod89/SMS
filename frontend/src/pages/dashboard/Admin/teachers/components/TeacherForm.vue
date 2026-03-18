<template>
  <div class="p-2">
    <a-form 
      :ref="formRef" 
      :model="formState" 
      layout="vertical"
      :rules="rules"
    >
      <div class="flex">
        <a-form-item
          label="Ism"
          name="name"
          class="flex-1 mr-1"
        >
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item
          label="Familya"
          name="surname"
          class="flex-1 ml-1"
        >
          <a-input v-model:value="formState.surname" />
        </a-form-item>
      </div>
      <div class="flex">
        <a-form-item
          label="Username"
          name="username"
          class="flex-1 mr-1"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>
        <a-form-item
          label="Parol"
          name="password"
          class="flex-1 ml-1"
        >
          <a-input v-model:value="formState.password" type="password" />
        </a-form-item>
      </div>

      <div class="flex">
        <a-form-item
          class="flex-1 mr-1"
          label="Qon guruhi"
          name="bloodType"
        >
          <a-select v-model:value="formState.bloodType">
            <a-select-option v-for="bt in bloodTypes" :key="bt" :value="bt">{{ bt }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          class="flex-1 ml-1"
          label="Tug'ilgan kun"
          name="birthday"
        >
          <a-input type="date" v-model:value="formState.birthday"></a-input>
        </a-form-item>
      </div>
      <div class="flex">
        <a-form-item
          class="flex-1 mr-1"
          label="Jins"
          name="sex"
        >
          <a-radio-group v-model:value="formState.sex" name="sex">
            <a-radio value="male">Erkak</a-radio>
            <a-radio value="female">Ayol</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          class="flex-1 ml-1"
          label="Rasm"
          name="img"
        >
          <a-upload
            list-type="picture-card"
            :max-count="1"
            :show-upload-list="false"
            :before-upload="handleImgUpload"
          >
            <img v-if="formState.img" :src="formState.img" style="width: 100%; height: 100%; object-fit: cover;" />
            <div v-else>+ Rasm yuklash</div>
          </a-upload>
        </a-form-item>
      </div>
      <a-form-item
        label="Email"
        name="email"
      >
        <a-input v-model:value="formState.email" />
      </a-form-item>
      
      <a-form-item
        label="Manzil"
        name="address"
      >
        <a-input v-model:value="formState.address" />
      </a-form-item>
      <div class="flex">
        <a-form-item
          class="flex-1 mr-1"
          label="Phone"
          name="phone"
        >
          <a-input v-model:value="formState.phone" />
        </a-form-item>
        <a-form-item
          class="flex-1 ml-1" 
          label="Fanlar" 
          name="subjects"
        >
          <a-select
            v-model:value="formState.subjects"
            mode="multiple"
            :loading="subjectsLoading"
          >
            <a-select-option
              v-for="subject in subjects"
              :key="subject._id || subject.id"
              :value="subject._id || subject.id"
            >
              {{ `${subject.name || ''} ${subject.surname || ''}`.trim() }}
            </a-select-option>
          </a-select>
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
// 1. Imports - Vue core
import { useFormValidation } from "@/composables/useFormValidation";
import { getSubjects } from "@/services/modules/subjects/subjects.service";
import { TeacherSchema } from "@/utils/validation";
import { onMounted, ref } from "vue";

// 2. Props
const props = defineProps({
  mode: {
    type: String,
    default: "create", // create or edit
  },
  loading: {
    type: Boolean,
    default: false,
  },
  teacher: {
    type: Object,
    default: () => ({
      ...TeacherSchema.initialState
    }),
  },
});

// 3. Emits
const emit = defineEmits(["cancel", "submit"]);

const {formRef, formState, rules, createSubmitHandler, setupWatchers} = useFormValidation({
  schema: TeacherSchema.schema,
  initialState: TeacherSchema.initialState,
  mapToFormState: TeacherSchema.mapToFormState,
})

setupWatchers(() => props, { dataKey: 'teacher', modeKey: 'mode' })

const handleSubmit = createSubmitHandler((data) => emit('submit', data))


// Qon guruhlari
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Rasm yuklash
const handleImgUpload = (file) => {};

// Fanlar ro'yxati
const subjects = ref([]);
const subjectsLoading = ref(false);

const loadSubjects = async () => {
  if (subjects.value.length > 0) return;

  subjectsLoading.value = true;
  try {
    const result = await getSubjects({ page: 1, limit: 100 });
    if (result.success) {
      subjects.value = result.data;
    }
  } catch (error) {
    console.error("Fanlarni yuklashda xatolik:", error);
    subjects.value = [];
  } finally {
    subjectsLoading.value = false;
  }
};

onMounted(() => {
  loadSubjects();
});
</script>
<style scoped></style>

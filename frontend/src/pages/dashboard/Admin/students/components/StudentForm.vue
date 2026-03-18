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
          <a-select v-model:value="formState.bloodType" placeholder="Tanlang">
            <a-select-option v-for="bt in bloodTypes" :key="bt" :value="bt">{{ bt }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          class="flex-1 ml-1"
          label="Tug'ilgan kun"
          name="birthday"
        >
          <a-input type="date" v-model:value="formState.birthday" />
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
          label="Telefon"
          name="phone"
        >
          <a-input v-model:value="formState.phone" placeholder="+998901234567" />
        </a-form-item>
        <a-form-item
          class="flex-1 ml-1"
          label="Sinf"
          name="classId"
        >
          <a-select
            v-model:value="formState.classId"
            :loading="classesLoading"
            placeholder="Tanlang"
          >
            <a-select-option
              v-for="cls in classes"
              :key="cls._id || cls.id"
              :value="cls._id || cls.id"
            >
              {{ cls.name || '' }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>

      <a-form-item
        label="Ota-ona"
        name="parentId"
      >
        <a-select
          v-model:value="formState.parentId"
          :loading="parentsLoading"
          placeholder="Tanlang (ixtiyoriy)"
          allow-clear
        >
          <a-select-option
            v-for="parent in parents"
            :key="parent._id || parent.id"
            :value="parent._id || parent.id"
          >
            {{ `${parent.name || ''} ${parent.surname || ''}`.trim() }}
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
import { useFormValidation } from "@/composables/useFormValidation";
import { getClasses } from "@/services/modules/classes/classes.service";
import { getParents } from "@/services/modules/parents/parents.service";
import { StudentSchema } from "@/utils/validation";
import { onMounted, ref } from "vue";

// Props
const props = defineProps({
  mode: {
    type: String,
    default: "create", // create or edit
  },
  loading: {
    type: Boolean,
    default: false,
  },
  student: {
    type: Object,
    default: () => ({ ...StudentSchema.initialState }),
  },
});

// Emits
const emit = defineEmits(["cancel", "submit"]);

const { formRef, formState, rules, createSubmitHandler, setupWatchers } = useFormValidation({
  schema: StudentSchema.schema,
  initialState: StudentSchema.initialState,
  mapToFormState: StudentSchema.mapToFormState,
});

setupWatchers(() => props, { dataKey: 'student', modeKey: 'mode' });

const handleSubmit = createSubmitHandler((data) => emit('submit', data));

// Qon guruhlari
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Rasm yuklash
const handleImgUpload = (file) => {};

// Sinflar ro'yxati
const classes = ref([]);
const classesLoading = ref(false);

const loadClasses = async () => {
  if (classes.value.length > 0) return;

  classesLoading.value = true;
  try {
    const result = await getClasses({ page: 1, limit: 100 });
    if (result.success) {
      classes.value = result.data;
    }
  } catch (error) {
    console.error("Sinflarni yuklashda xatolik:", error);
    classes.value = [];
  } finally {
    classesLoading.value = false;
  }
};

// Ota-onalar ro'yxati
const parents = ref([]);
const parentsLoading = ref(false);

const loadParents = async () => {
  if (parents.value.length > 0) return;

  parentsLoading.value = true;
  try {
    const result = await getParents({ page: 1, limit: 100 });
    if (result.success) {
      parents.value = result.data;
    }
  } catch (error) {
    console.error("Ota-onalarni yuklashda xatolik:", error);
    parents.value = [];
  } finally {
    parentsLoading.value = false;
  }
};

onMounted(() => {
  loadClasses();
  loadParents();
});
</script>

<style scoped></style>

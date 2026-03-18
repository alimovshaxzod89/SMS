<template>
    <div class="p-2">
        <a-form
            :ref="formRef"
            :model="formState"
            :rules="rules"
            layout="vertical"
        >
            <a-form-item label="Sinf nomi" name="name">
                <a-input v-model:value="formState.name" />
            </a-form-item>
            <a-form-item label="Sig'im" name="capacity">
                <a-input-number
                    v-model:value="formState.capacity"
                    :min="1"
                    class="w-full"
                />
            </a-form-item>
            <a-form-item label="Daraja" name="gradeId">
                <a-select
                    v-model:value="formState.gradeId"
                    :loading="loadingGrades"
                    placeholder="Darajani tanlang"
                >
                    <a-select-option
                        v-for="grade in grades"
                        :key="grade._id || grade.id"
                        :value="grade._id || grade.id"
                    >
                        {{ grade.level || grade.name || grade }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="Supervisor (O'qituvchi)" name="supervisorId">
                <a-select
                    v-model:value="formState.supervisorId"
                    :loading="loadingTeachers"
                    placeholder="O'qituvchini tanlang (ixtiyoriy)"
                    allow-clear
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
            <a-form-item label="O'quvchilar" name="students">
                <a-select
                    v-model:value="formState.students"
                    mode="multiple"
                    :loading="loadingStudents"
                    placeholder="O'quvchilarni tanlang (ixtiyoriy)"
                    allow-clear
                >
                    <a-select-option
                        v-for="student in students"
                        :key="student._id || student.id"
                        :value="student._id || student.id"
                    >
                        {{ `${student.name || ''} ${student.surname || ''}`.trim() }}
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
import { ClassSchema } from '@/utils/validation';
import { getTeachers } from '@/services/modules/teachers/teachers.service';
import { getStudents } from '@/services/modules/students/students.service';
import api from '@/utils/api';
import { useCore } from '@/store/core.pinia';

const core = useCore();

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
    classData: {
        type: Object,
        default: () => null,
    },
});

// Emits
const emit = defineEmits(['cancel', 'submit']);

// Form validatsiya - composable orqali
const { formRef, formState, rules, createSubmitHandler, setupWatchers } =
    useFormValidation({
        schema:         ClassSchema.schema,
        initialState:   ClassSchema.initialState,
        mapToFormState: ClassSchema.mapToFormState,
    });

// Watchers setup
setupWatchers(() => props, { dataKey: 'classData', modeKey: 'mode' });

// Submit handler
const handleSubmit = createSubmitHandler((data) => {
    emit('submit', data);
});

// Teachers
const teachers = ref([]);
const loadingTeachers = ref(false);

const loadTeachers = async () => {
    if (teachers.value.length > 0) return;

    loadingTeachers.value = true;
    try {
        const result = await getTeachers({ page: 1, limit: 100 });
        if (result.success) {
            teachers.value = result.data;
        }
    } catch (error) {
        console.error("O'qituvchilarni yuklashda xatolik:", error);
        teachers.value = [];
    } finally {
        loadingTeachers.value = false;
    }
};

// Grades
const grades = ref([]);
const loadingGrades = ref(false);

const loadGrades = async () => {
    if (grades.value.length > 0) return;

    loadingGrades.value = true;
    try {
        const response = await api.get('/grades', { params: { page: 1, limit: 100 } });
        if (response.data.success) {
            grades.value = response.data.data || [];
        }
    } catch (error) {
        console.error("Grades ro'yxatini yuklashda xatolik:", error);
        core.setToast({ type: 'error', message: 'Darajalarni yuklashda xatolik yuz berdi' });
        grades.value = [];
    } finally {
        loadingGrades.value = false;
    }
};

// Students
const students = ref([]);
const loadingStudents = ref(false);

const loadStudents = async () => {
    if (students.value.length > 0) return;

    loadingStudents.value = true;
    try {
        const result = await getStudents({ page: 1, limit: 200 });
        if (result.success) {
            students.value = result.data;
        }
    } catch (error) {
        console.error("O'quvchilarni yuklashda xatolik:", error);
        students.value = [];
    } finally {
        loadingStudents.value = false;
    }
};

onMounted(() => {
    loadTeachers();
    loadGrades();
    loadStudents();
});
</script>

<style scoped></style>

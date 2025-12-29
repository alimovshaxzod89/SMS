<template>
    <div class="p-2">
        <a-form
            ref="formRef"
            :model="formState"
            layout="vertical"
        >
            <a-form-item
                label="Sinf nomi"
                name="name"
                :rules="[{ required: true, message: 'Sinf nomini kiriting' }]"
            >
                <a-input v-model:value="formState.name" />
            </a-form-item>
            <a-form-item
                label="Sig'im"
                name="capacity"
                :rules="[
                    { required: true, message: 'Sig\'imni kiriting' },
                    { type: 'number', min: 1, message: 'Sig\'im 1 dan katta bo\'lishi kerak' }
                ]"
            >
                <a-input-number 
                    v-model:value="formState.capacity" 
                    :min="1"
                    class="w-full"
                />
            </a-form-item>
            <a-form-item
                label="Daraja"
                name="gradeId"
                :rules="[{ required: true, message: 'Darajani tanlang' }]"
            >
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
            <a-form-item
                label="Supervisor (O'qituvchi)"
                name="supervisorId"
            >
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
            <div class="flex justify-end gap-2">
                <a-button
                    @click="emit('cancel')"
                    :disabled="loading"
                >
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
// 1. Imports
import { ref, watch, onMounted } from 'vue';
import { getTeachers } from '@/services/modules/teachers/teachers.service';
import api from '@/utils/api';
import { useCore } from '@/store/core.pinia';

const core = useCore();

// 2. Props
const props = defineProps({
    mode: {
        type: String,
        default: 'create' // create or edit
    },
    loading: {
        type: Boolean,
        default: false
    },
    classData: {
        type: Object,
        default: () => ({
            name: '',
            capacity: null,
            gradeId: null,
            supervisorId: null
        })
    }
});

// 3. Emits
const emit = defineEmits(['cancel', 'submit']);

// 4. Refs / State
const formRef = ref(null);
const formState = ref({
    name: '',
    capacity: null,
    gradeId: null,
    supervisorId: null
});

// Local state
const teachers = ref([]);
const grades = ref([]);
const loadingTeachers = ref(false);
const loadingGrades = ref(false);

// 5. Methods
const handleSubmit = () => {
    formRef.value?.validate()
        .then(() => {
            emit('submit', formState.value);
        })
        .catch((error) => {
            console.error(error);
        });
};

const loadTeachers = async () => {
    if (teachers.value.length === 0) {
        loadingTeachers.value = true;
        try {
            const result = await getTeachers({ 
                page: 1, 
                limit: 100
            });
            
            if (result.success) {
                teachers.value = result.data;
            }
        } catch (error) {
            console.error('O\'qituvchilarni yuklashda xatolik:', error);
            teachers.value = [];
        } finally {
            loadingTeachers.value = false;
        }
    }
};

const loadGrades = async () => {
    if (grades.value.length === 0) {
        loadingGrades.value = true;
        try {
            // Grades ro'yxatini olish uchun API endpoint
            const response = await api.get('/grades', {
                params: {
                    page: 1,
                    limit: 100
                }
            });
            
            if (response.data.success) {
                grades.value = response.data.data || [];
            }
        } catch (error) {
            console.error('Grades ro\'yxatini yuklashda xatolik:', error);
            core.setToast({
                type: 'error',
                message: 'Darajalarni yuklashda xatolik yuz berdi',
            });
            grades.value = [];
        } finally {
            loadingGrades.value = false;
        }
    }
};

// 6. Watchers
// Props o'zgarganda formState ni yangilash
watch(
    () => props.classData,
    (newClass) => {
        if (newClass && Object.keys(newClass).length > 0) {
            // gradeId ni to'g'ri formatlash
            // gradeId object bo'lsa (populate qilingan), uning _id ni olish
            // Aks holda to'g'ridan-to'g'ri gradeId ni ishlatish
            let gradeId = null;
            if (newClass.gradeId) {
                if (typeof newClass.gradeId === 'object' && newClass.gradeId._id) {
                    gradeId = newClass.gradeId._id;
                } else if (typeof newClass.gradeId === 'object' && newClass.gradeId.id) {
                    gradeId = newClass.gradeId.id;
                } else {
                    gradeId = newClass.gradeId;
                }
            }
            
            // supervisorId ni to'g'ri formatlash
            // supervisorId object bo'lsa (populate qilingan), uning _id ni olish
            // Aks holda to'g'ridan-to'g'ri supervisorId ni ishlatish
            let supervisorId = null;
            if (newClass.supervisorId) {
                if (typeof newClass.supervisorId === 'object' && newClass.supervisorId._id) {
                    supervisorId = newClass.supervisorId._id;
                } else if (typeof newClass.supervisorId === 'object' && newClass.supervisorId.id) {
                    supervisorId = newClass.supervisorId.id;
                } else {
                    supervisorId = newClass.supervisorId;
                }
            }
            
            formState.value = {
                name: newClass.name || '',
                capacity: newClass.capacity || null,
                gradeId: gradeId,
                supervisorId: supervisorId
            };
        } else {
            // Create mode uchun formani tozalash
            formState.value = {
                name: '',
                capacity: null,
                gradeId: null,
                supervisorId: null
            };
        }
    },
    { immediate: true, deep: true }
);

// Mode o'zgarganda ham formani tozalash
watch(
    () => props.mode,
    (newMode) => {
        if (newMode === 'create') {
            formState.value = {
                name: '',
                capacity: null,
                gradeId: null,
                supervisorId: null
            };
            // Form validatsiyasini tozalash
            formRef.value?.resetFields();
        }
    }
);

// 7. Lifecycle Hooks
onMounted(() => {
    loadTeachers();
    loadGrades();
});
</script>
<style scoped></style>


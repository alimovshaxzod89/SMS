<template>
    <div class="p-2">
        <a-form
            :ref="formRef"
            :model="formState"
            :rules="rules"
            layout="vertical"
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
                    label="Telefon"
                    name="phone"
                    class="flex-1 mr-1"
                >
                    <a-input v-model:value="formState.phone" placeholder="+998901234567" />
                </a-form-item>
                <a-form-item
                    label="Email (ixtiyoriy)"
                    name="email"
                    class="flex-1 ml-1"
                >
                    <a-input v-model:value="formState.email" />
                </a-form-item>
            </div>

            <a-form-item
                label="Manzil"
                name="address"
            >
                <a-input v-model:value="formState.address" />
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
import { useFormValidation } from '@/composables/useFormValidation';
import { ParentSchema } from '@/utils/validation';

const props = defineProps({
    mode: {
        type: String,
        default: 'create',
    },
    loading: {
        type: Boolean,
        default: false,
    },
    parent: {
        type: Object,
        default: () => ({ ...ParentSchema.initialState }),
    },
});

const emit = defineEmits(['cancel', 'submit']);

const { formRef, formState, rules, createSubmitHandler, setupWatchers } = useFormValidation({
    schema: ParentSchema.schema,
    initialState: ParentSchema.initialState,
    mapToFormState: ParentSchema.mapToFormState,
});

setupWatchers(() => props, { dataKey: 'parent', modeKey: 'mode' });

const handleSubmit = createSubmitHandler((data) => emit('submit', data));
</script>

<style scoped></style>

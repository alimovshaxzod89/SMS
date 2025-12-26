<template>
    <div class="p-2">
        <a-form
            ref="formRef"
            :model="formState"
            layout="vertical"
        >
            <a-form-item
                label="F.I.O"
                name="name"
                :rules="[{ required: true, message: 'Please input your F.I.O' }]"
            >
                <a-input v-model:value="formState.name" />
            </a-form-item>
            <a-form-item
                label="Email"
                name="email"
                :rules="[
                    { required: true, message: 'Please input your email' },
                    { type: 'email', message: 'Please input a valid email' }
                ]"
            >
                <a-input v-model:value="formState.email" />
            </a-form-item>
            <a-form-item
                label="Phone"
                name="phone"
                :rules="[{ required: true, message: 'Please input your phone' }]"
            >
                <a-input v-model:value="formState.phone" />
            </a-form-item>
            <a-form-item
                label="Manzil"
                name="address"
                :rules="[{ required: true, message: 'Please input your address' }]"
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
import { ref, watch } from 'vue';

const props = defineProps({
    mode: {
        type: String,
        default: 'create' // create or edit
    },
    loading: {
        type: Boolean,
        default: false
    },
    parent: {
        type: Object,
        default: () => ({
            name: '',
            email: '',
            phone: '',
            address: ''
        })
    }
})
const emit = defineEmits(['cancel', 'submit']);

const formRef = ref(null);
const formState = ref({
    name: '',
    email: '',
    phone: '',
    address: ''
});

// Props o'zgarganda formState ni yangilash
watch(
    () => props.parent,
    (newParent) => {
        if (newParent) {
            formState.value = {
                name: newParent.name || '',
                email: newParent.email || '',
                phone: newParent.phone || '',
                address: newParent.address || ''
            };
        } else {
            // Create mode uchun formani tozalash
            formState.value = {
                name: '',
                email: '',
                phone: '',
                address: ''
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
                email: '',
                phone: '',
                address: ''
            };
            // Form validatsiyasini tozalash
            formRef.value?.resetFields();
        }
    }
);

const handleSubmit = () => {
    formRef.value?.validate()
    .then(() => {
        emit('submit', formState.value);
    })
    .catch((error) => {
        console.error(error);
    })
}
</script>
<style scoped></style>
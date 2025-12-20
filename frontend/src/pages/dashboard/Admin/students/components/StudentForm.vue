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

const emit = defineEmits(['submit', 'cancel']);

const props = defineProps({
    mode: {
        type: String,
        default: 'create',
    },
    loading: {
        type: Boolean,
        default: false,
    },
    student: {
        type: Object,
        default: () => ({
            name: '',
            email: '',
            phone: '',
            address: '',
        })
    }
});

const formRef = ref(null);
const formState = ref({
    name: '',
    email: '',
    phone: '',
    address: ''
});

watch(() => props.student, (newVal) => {
    if (newVal) {
        formState.value = {
            name: newVal.name,
            email: newVal.email,
            phone: newVal.phone,
            address: newVal.address
        };
    }else{
        formState.value = {
            name: '',
            email: '',
            phone: '',
            address: ''
        };
    }
}, { immediate: true,deep: true });

watch(() => props.mode, (newVal) => {
    if (newVal === 'create') {
        formState.value = {
            name: '',
            email: '',
            phone: '',
            address: ''
        };
    }
})

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
<style scoped>
</style>
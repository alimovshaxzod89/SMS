<template>
    <!-- Search Bar -->
    <div class="w-full md:w-auto flex items-center gap-2 bg-[#F7F8FA] border border-gray-200 rounded-md px-2 flex-1 lg:flex-none max-w-md ml-4 lg:ml-0">
      <IconSearch />
      <a-input 
        :value="modelValue"
        @input="handleInput"
        @press-enter="handleEnter"
        placeholder="Search..." 
        :bordered="false"
        class="!bg-[#F7F8FA] !outline-none"
        allow-clear
      />
    </div>
</template>

<script setup>
import IconSearch from '@components/icon/menu-icons/IconSearch.vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue', 'search', 'press-enter']);

const handleInput = (e) => {
  const value = e.target.value;
  emit('update:modelValue', value);
  emit('search', value);
}

const handleEnter = () => {
  emit('press-enter', props.modelValue);
};
</script>

<style scoped>
</style>


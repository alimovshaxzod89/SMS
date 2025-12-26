<template>
  <a-card class="flex-1 m-4 mt-0 border-none">
    <!-- Top -->
    <div class="flex items-center justify-between">
      <a-typography-title :level="4" class="!mb-0 hidden md:block">
        All Students
      </a-typography-title>
      <div class="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <BaseTableSearch 
          v-model="searchValue" 
          @search="handleSearch" 
          @press-enter="handlePressEnter" 
        />
        <a-space class="self-end">
          <a-button 
            shape="circle" 
            type="text"
            class="bg-yellow-300 hover:bg-yellow-400"
          >
            <template #icon>
              <IconFilter />
            </template>
          </a-button>
          <a-button 
            shape="circle" 
            type="text"
            class="bg-yellow-300 hover:bg-yellow-400"
          >
            <template #icon>
              <IconSort />
            </template>
          </a-button>
          <a-button 
            @click="emit('addStudent')"
            shape="circle" 
            type="text"
            class="bg-yellow-300 hover:bg-yellow-400"
          >
            <template #icon>
              <IconPlus />
            </template>
          </a-button>
        </a-space>
      </div>
    </div>
    
    <!-- List -->
    <div class="mt-4 overflow-x-auto">
      <BaseTable 
        :columns="tableColumns" 
        :data-source="formattedStudents" 
        :loading="studentsStore.isLoading"
        :pagination="paginationConfig"
        :permissions="permissions"
        :scroll="{ x: 'max-content' }"
        @change-page="handleTableChange"
        @view-row="handleView"
        @edit-row="handleEdit"
        @delete-row="handleDelete"
      />
    </div>
  </a-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import {useRouter, useRoute} from 'vue-router'
import BaseTableSearch from '@components/base-components/BaseTableSearch.vue';
import IconFilter from '@components/icon/IconFilter.vue';
import IconSort from '@components/icon/IconSort.vue';
import IconPlus from '@components/icon/IconPlus.vue';
import BaseTable from '@components/base-components/BaseTable.vue';
import { useStudentsStore } from '@/store/student/students.pinia';
import { useSearch } from '@/composables/useSearch';

const router = useRouter();
const route = useRoute();
const studentsStore = useStudentsStore();

const props = defineProps({
  permissions: {
    type: Object,
    default: () => ({
      canEdit: true,
      canDelete: true,
      canView: true,
    })
  },
  role: {
    type: String,
    default: 'ADMIN'
  }
});

const emit = defineEmits(['addStudent', 'editStudent', 'deleteStudent']);

const {searchValue} = useSearch({
  debounceMs: 500,
  queryKey: 'search',
  onSearch: (value) => {
    performSearch(value);
  }
});

const performSearch = (searchQuery = '') => {
  const page = parseInt(route.query.page) || 1;
  const pageSize = parseInt(route.query.pageSize) || 10;  
  studentsStore.fetchStudents({
    page,
    pageSize,
    search: searchQuery,
  });
};

const handleSearch = (value) => {
  // useSearch composable avtomatik handle qiladi
};
const handlePressEnter = () => {
  performSearch(searchValue.value);
};

// Table columns konfiguratsiyasi
const tableColumns = computed(() => [
  {
    title: '№',
    key: 'number',
    width: 60,
    align: 'center',
    fixed: 'left' // Agar boshqa columnlar fixed bo'lmasa
  },
  {
    title: 'Rasm',
    key: 'photo',
    dataIndex: 'photo',
    width: 80,
    align: 'center'
  },
  {
    title: 'F.I.O.',
    key: 'name',
    dataIndex: 'name',
    sorter: true,
    align: 'center',
    ellipsis: true,
    customRender: ({ record }) => `${record.name} ${record.surname}`
  },
  {
    title: 'Darajasi',
    key: 'gradeId',
    dataIndex: 'gradeId',
    align: 'center',
    ellipsis: true,
  },
  {
    title: 'Sinf',
    key: 'classId',
    dataIndex: 'classId',
    align: 'center',
    ellipsis: true,
  },
  {
    title: 'Telefon',
    key: 'phone',
    dataIndex: 'phone',
    align: 'center',
    ellipsis: true,
  },
  {
    title: 'Manzil',
    key: 'address',
    dataIndex: 'address',
    align: 'center',
    ellipsis: true,
  },
  {
    title: 'Amallar',
    key: 'action',
    width: 150,
    align: 'center'
  }
]);

// Formatlangan talabalar ro'yxati
const formattedStudents = computed(() => {
  return studentsStore.getStudents.map(student => ({
    ...student,
    key: student._id || student.id, // Table uchun unique key
  }));
});

// Pagination config
const paginationConfig = computed(() => ({
  current: studentsStore.pagination.currentPage,
  pageSize: studentsStore.pagination.pageSize,
  total: studentsStore.pagination.total,
  showSizeChanger: true,
  showTotal: (total) => `Jami ${total} ta talaba`,
  pageSizeOptions: ['10', '20', '50', '100'],
}));

/**
 * URL query params'ni yangilash
 */
 const updateURLParams = (params) => {
  const query = {
    ...route.query,
    ...params,
  };
  
  // Bo'sh qiymatlarni olib tashlash
  Object.keys(query).forEach(key => {
    if (query[key] === '' || query[key] === null || query[key] === undefined) {
      delete query[key];
    }
  });
  
  router.replace({ query });
};

/**
 * URL query params'dan ma'lumotlarni o'qib, store'ga yuborish
 */
 const loadFromURL = () => {
  const query = route.query;
  const page = parseInt(query.page) || 1;
  const pageSize = parseInt(query.pageSize) || 10;
  const search = query.search || '';
  
  searchValue.value = search;
  
  studentsStore.fetchStudents({
    page,
    pageSize,
    search,
  });
};

// handleTableChange ni yangilash - URL bilan birga
const handleTableChange = ({ pag }) => {
  if (pag) {
    updateURLParams({
      page: pag.current,
      pageSize: pag.pageSize,
      search: searchValue.value || '',
    });
  }
};

// URL query params o'zgarganda (browser back/forward)
watch(() => route.query, (newQuery) => {
  const page = parseInt(newQuery.page) || 1;
  const pageSize = parseInt(newQuery.pageSize) || 10;
  const search = newQuery.search || '';
  
  if (
    studentsStore.pagination.currentPage !== page ||
    studentsStore.pagination.pageSize !== pageSize ||
    searchValue.value !== search
  ) {
    searchValue.value = search;
    studentsStore.fetchStudents({
      page,
      pageSize,
      search,
    });
  }
}, { deep: true });

onMounted(() => {
  if (Object.keys(route.query).length > 0) {
    loadFromURL();
  } else {
    studentsStore.fetchStudents();
  }
});

const handleView = (record) => {
  router.push({name: "StudentDetail", params: {id: record.id}})
  // View logic
};

const handleEdit = (record) => {
  emit('editStudent', record);
  // Edit logic
};

const handleDelete = (record) => {
  emit('deleteStudent', record);
  // Delete logic with confirmation
};
</script>

<style scoped></style>
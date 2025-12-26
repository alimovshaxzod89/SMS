<template>
  <a-card class="flex-1 m-4 mt-0 border-none">
    <!-- Top -->
    <div class="flex items-center justify-between">
      <a-typography-title :level="4" class="!mb-0 hidden md:block">
        All Teachers
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
            @click="emit('addTeacher')"
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
        :data-source="formattedTeachers" 
        :loading="teachersStore.isLoading"
        :pagination="paginationConfig"
        :permissions="permissions"
        :scroll="{ x: 'max-content' }"
        @view-row="handleView"
        @edit-row="handleEdit"
        @delete-row="handleDelete"
        @change-page="handleTableChange"
      />
    </div>
  </a-card>
</template>

<script setup>
// 1. Imports - Vue core
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// 2. Imports - Components
import BaseTable from '@components/base-components/BaseTable.vue';
import BaseTableSearch from '@components/base-components/BaseTableSearch.vue';
import IconFilter from '@components/icon/IconFilter.vue';
import IconPlus from '@components/icon/IconPlus.vue';
import IconSort from '@components/icon/IconSort.vue';
// 3. Imports - Composables
import { useSearch } from '@/composables/useSearch';
// 4. Imports - Store
import { useTeachersStore } from '@/store/teacher/teachers.pinia';


// 5. Composables
const router = useRouter();
const route = useRoute();
const teachersStore = useTeachersStore();

// 6. Props
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

// 7. Emits
const emit = defineEmits(['addTeacher', 'editTeacher', 'deleteTeacher']);

// 8. Composables (useSearch)
const { searchValue } = useSearch({
  debounceMs: 500,
  queryKey: 'search',
  onSearch: (value) => {
    performSearch(value);
  }
});

// 9. Methods
const performSearch = (searchQuery = '') => {
  const page = parseInt(route.query.page) || 1;
  const pageSize = parseInt(route.query.pageSize) || 10;
  
  teachersStore.fetchTeachers({
    page,
    pageSize,
    search: searchQuery,
  });
};

/**
 * URL query params'ni yangilash (browser history'ga yozilmaydi)
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
  
  // Local state'ni yangilash
  searchValue.value = search;
  
  // Agar search bo'sh bo'lsa, to'g'ridan-to'g'ri yuklash
  if (!search) {
    teachersStore.fetchTeachers({
      page,
      pageSize,
      search: '',
    });
  }
};

/**
 * Pagination o'zgarganda URL'ni yangilash
 */
const handleTableChange = ({ pag, filters, sorter }) => {
  if (pag) {
    updateURLParams({
      page: pag.current,
      pageSize: pag.pageSize,
      search: searchValue.value || '',
    });
    
    // Store'ga yuborish
    // teachersStore.fetchTeachers({
    //   page: pag.current,
    //   pageSize: pag.pageSize,
    //   search: searchValue.value,
    // });
  }

  // Kelajakda sorter va filterlarni ham qo'shish mumkin
  if (sorter) {
    // Sorting logikasi
  }
  
  if (filters) {
    // Filter logikasi
  }
};

const handleView = (record) => {
  router.push({ 
    name: "TeacherDetail", 
    params: { id: record._id || record.id } 
  });
};

const handleEdit = (record) => {
  emit('editTeacher', record);
};

const handleDelete = (record) => {
  emit('deleteTeacher', record);
};

const handleSearch = (value) => {};
const handlePressEnter = () => {};

// 10. Computed Properties
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
    width: 200,
    align: 'center',
    customRender: ({ record }) => `${record.name} ${record.surname}`
  },
  {
    title: 'Fanlar',
    key: 'subjects',
    dataIndex: 'subjects',
    width: 250,
    align: 'center',
  },
  {
    title: 'Sinflar',
    key: 'classes',
    dataIndex: 'classes',
    width: 250,
    align: 'center',
  },
  // {
  //   title: 'Email',
  //   key: 'email',
  //   dataIndex: 'email',
  //   width: 200,
  //   align: 'center'
  // },
  {
    title: 'Telefon',
    key: 'phone',
    dataIndex: 'phone',
    width: 150,
    align: 'center'
  },
  {
    title: 'Manzil',
    key: 'address',
    dataIndex: 'address',
    ellipsis: true,
    align: 'center'
  },
  {
    title: 'Amallar',
    key: 'action',
    width: 150,
    fixed: 'right',
    align: 'center'
  }
]);

// Formatlangan o'qituvchilar ro'yxati
const formattedTeachers = computed(() => {
  return teachersStore.getTeachers.map(teacher => ({
    ...teacher,
    key: teacher._id || teacher.id, // Table uchun unique key
  }));
});

// Pagination config
const paginationConfig = computed(() => ({
  current: teachersStore.pagination.currentPage,
  pageSize: teachersStore.pagination.pageSize,
  total: teachersStore.pagination.total,
  showSizeChanger: true,
  showTotal: (total) => `Jami ${total} ta o'qituvchi`,
  pageSizeOptions: ['10', '20', '50', '100'],
}));

// 11. Watchers
/**
 * URL query params o'zgarganda (browser back/forward) ma'lumotlarni yangilash
 */
watch(() => route.query, (newQuery) => {
  // Faqat URL o'zgarganda ishlaydi (component ichida o'zgartirishlar emas)
  const page = parseInt(newQuery.page) || 1;
  const pageSize = parseInt(newQuery.pageSize) || 10;
  const search = newQuery.search || '';
  
  // Agar store'dagi qiymatlar URL'dan farq qilsa, yangilash
  if (
    teachersStore.pagination.currentPage !== page ||
    teachersStore.pagination.pageSize !== pageSize ||
    searchValue.value !== search
  ) {
    searchValue.value = search;
    teachersStore.fetchTeachers({
      page,
      pageSize,
      search,
    });
  }
}, { deep: true });

// 12. Lifecycle Hooks
// Component mount bo'lganda o'qituvchilarni yuklash
onMounted(() => {
  // Agar URL'da query params bo'lsa, ularni ishlatish
  if (Object.keys(route.query).length > 0) {
    loadFromURL();
  } else {
    // Aks holda default qiymatlar bilan yuklash
    teachersStore.fetchTeachers();
  }
});
</script>

<style scoped></style>
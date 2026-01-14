<template>
  <a-card class="flex-1 m-4 mt-0 border-none">
    <!-- Top -->
    <div class="flex items-center justify-between">
      <a-typography-title :level="4" class="!mb-0 hidden md:block">
        All Parents
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
            @click="emit('addParent')"
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
        :data-source="formattedParents" 
        :loading="parentsStore.isLoading"
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
import { useParentsStore } from '@/store/parent/parents.pinia';


// 5. Composables
const router = useRouter();
const route = useRoute();
const parentsStore = useParentsStore();

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
const emit = defineEmits(['addParent', 'editParent', 'deleteParent']);

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
  
  parentsStore.fetchParents({
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
    parentsStore.fetchParents({
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
    parentsStore.fetchParents({
      page: pag.current,
      pageSize: pag.pageSize,
      search: searchValue.value,
    });
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
  console.log('View parent:', record);
  // View logic
};

const handleEdit = (record) => {
  emit('editParent', record);
};

const handleDelete = (record) => {
  emit('deleteParent', record);
};

const handleSearch = (value) => {};
const handlePressEnter = () => {};

// 10. Computed Properties
// Table columns konfiguratsiyasi
const tableColumns = computed(() => {
  const baseColumns = [
    {
      title: '№',
      key: 'number',
      width: 60,
      align: 'center',
      fixed: 'left'
    },
    {
      title: 'F.I.O.',
      key: 'name',
      dataIndex: 'name',
      width: 300,
      sorter: true,
      ellipsis: true,
      customRender: ({ record }) => `${record.name} ${record.surname}`
    },
    {
      title: 'Talabalar',
      key: 'students',
      dataIndex: 'students',
      align: 'center',
      ellipsis: true
    },
    {
      title: 'Telefon',
      key: 'phone',
      dataIndex: 'phone',
      align: 'center',
      ellipsis: true
    },
    {
      title: 'Manzil',
      key: 'address',
      dataIndex: 'address',
      ellipsis: true,
      align: 'center'
    },
  ];

  // Faqat Admin va Teacher rollari uchun actions columnini qo'shish
  const canManageParents = props.role === 'ADMIN' || props.role === 'TEACHER';
  
  if (canManageParents) {
    baseColumns.push({
      title: 'Amallar',
      key: 'action',
      width: 150,
      align: 'center',
      ellipsis: true
    });
  }

  return baseColumns;
});

// Formatlangan ota-onalar ro'yxati
const formattedParents = computed(() => {
  return parentsStore.getParents.map(parent => ({
    ...parent,
    key: parent._id || parent.id,
  }));
});

// Pagination config
const paginationConfig = computed(() => ({
  current: parentsStore.pagination.currentPage,
  pageSize: parentsStore.pagination.pageSize,
  total: parentsStore.pagination.total,
  showSizeChanger: true,
  showTotal: (total) => `Jami ${total} ta ota-ona`,
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
    parentsStore.pagination.currentPage !== page ||
    parentsStore.pagination.pageSize !== pageSize ||
    searchValue.value !== search
  ) {
    searchValue.value = search;
    parentsStore.fetchParents({
      page,
      pageSize,
      search,
    });
  }
}, { deep: true });

// 12. Lifecycle Hooks
// Component mount bo'lganda ota-onalarni yuklash
onMounted(() => {
  // Agar URL'da query params bo'lsa, ularni ishlatish
  if (Object.keys(route.query).length > 0) {
    loadFromURL();
  } else {
    // Aks holda default qiymatlar bilan yuklash
    parentsStore.fetchParents();
  }
});
</script>

<style scoped></style>
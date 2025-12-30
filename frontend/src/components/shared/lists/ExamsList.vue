<template>
  <a-card class="flex-1 m-4 mt-0 border-none">
    <!-- Top -->
    <div class="flex items-center justify-between">
      <a-typography-title :level="4" class="!mb-0 hidden md:block">
        All Exams
      </a-typography-title>
      <div
        class="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto"
      >
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
            @click="emit('addExam')"
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
        :data-source="formattedExams"
        :loading="examsStore.isLoading"
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
// 4. Imports - Utils
import { formatDate } from '@/utils/helpers/dateFormatter';
// 5. Imports - Store
import { useExamsStore } from '@/store/exam/exams.pinia';


// 6. Composables
const router = useRouter();
const route = useRoute();
const examsStore = useExamsStore();

// 7. Props
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

// 8. Emits
const emit = defineEmits(['addExam', 'editExam', 'deleteExam']);

// 9. Composables (useSearch)
const { searchValue } = useSearch({
  debounceMs: 500,
  queryKey: 'search',
  onSearch: (value) => {
    performSearch(value);
  }
});

// 10. Computed
// Table columns konfiguratsiyasi
const tableColumns = computed(() => [
  {
    title: '№',
    key: 'number',
    width: 60,
    align: 'center',
    fixed: 'left'
  },
  {
    title: 'Fan',
    key: 'subject',
    dataIndex: 'subject',
    sorter: true,
    ellipsis: true,
  },
  {
    title: 'Sinf',
    key: 'class',
    dataIndex: 'class',
    sorter: true,
    align: 'center',
    ellipsis: true,
  },
  {
    title: 'O\'qituvchi',
    key: 'teacher',
    dataIndex: 'teacher',
    align: 'center',
    ellipsis: true,
  },
  {
    title: 'Sana',
    key: 'date',
    dataIndex: 'startTime',
    sorter: true,
    align: 'center',
    ellipsis: true,
  },
  {
    title: 'Amallar',
    key: 'action',
    width: 150,
    fixed: 'right',
    align: 'center'
  }
]);

// Formatlangan imtihonlar ro'yxati
const formattedExams = computed(() => {
  return examsStore.exams.map((exam) => ({
    ...exam,
    key: exam._id,
    subject: exam.lessonId?.subjectId?.name || '-',
    class: exam.lessonId?.classId?.name || '-',
    teacher: exam.lessonId?.teacherId?.name || '-',
    startTime: formatDate(exam.startTime),
  }));
});

// Pagination config
const paginationConfig = computed(() => ({
  current: examsStore.pagination.currentPage,
  pageSize: examsStore.pagination.pageSize,
  total: examsStore.pagination.total,
  showSizeChanger: true,
  showTotal: (total) => `Jami ${total} ta imtihon`,
  pageSizeOptions: ['10', '20', '50', '100'],
}));

// 11. Methods
/**
 * Qidiruvni amalga oshirish
 */
const performSearch = (searchQuery = '') => {
  const page = parseInt(route.query.page) || 1;
  const pageSize = parseInt(route.query.pageSize) || 10;
  
  examsStore.fetchExams({
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
    examsStore.fetchExams({
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
    // examsStore.fetchExams({
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

const handleSearch = (value) => {};

const handlePressEnter = () => {};

const handleView = (record) => {
  // View logic
};

const handleEdit = (record) => {
  emit('editExam', record);
};

const handleDelete = (record) => {
  emit('deleteExam', record);
};

// 12. Watchers
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
    examsStore.pagination.currentPage !== page ||
    examsStore.pagination.pageSize !== pageSize ||
    searchValue.value !== search
  ) {
    searchValue.value = search;
    examsStore.fetchExams({
      page,
      pageSize,
      search,
    });
  }
}, { deep: true });

// 13. Lifecycle Hooks
// Component mount bo'lganda imtihonlarni yuklash
onMounted(() => {
  // Agar URL'da query params bo'lsa, ularni ishlatish
  if (Object.keys(route.query).length > 0) {
    loadFromURL();
  } else {
    // Aks holda default qiymatlar bilan yuklash
    examsStore.fetchExams();
  }
});
</script>

<style scoped></style>

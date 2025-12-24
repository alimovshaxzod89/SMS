import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { debounce } from '@/utils/helpers/debounce';

/**
 * Search funksionalligi uchun composable
 * @param {Object} options - Sozlamalar
 * @param {Function} options.onSearch - Qidiruv bajarilganda chaqiriladigan funksiya
 * @param {number} options.debounceMs - Debounce vaqti (default: 500ms)
 * @param {string} options.queryKey - URL query parametr nomi (default: 'search')
 * @returns {Object} Search funksionalligi
 */
export function useSearch(options = {}) {
  const {
    onSearch,
    debounceMs = 500,
    queryKey = 'search'
  } = options;
  
  const route = useRoute();
  const router = useRouter();
  
  // Search qiymati
  const searchValue = ref(route.query[queryKey] || '');
  
  // Debounced search funksiyasi
  const debouncedSearch = debounce((value) => {
    if (onSearch) {
      onSearch(value);
    }
  }, debounceMs);
  
  // URL'ni yangilash (browser history'ga yozilmaydi)
  const updateURL = (value) => {
    const query = {
      ...route.query,
      [queryKey]: value || undefined,
      page: '1', // Qidiruvda birinchi sahifaga qaytish
    };
    
    // Bo'sh qiymatlarni olib tashlash
    Object.keys(query).forEach(key => {
      if (query[key] === undefined || query[key] === '') {
        delete query[key];
      }
    });
    
    router.replace({ query });
  };
  
  // Search qiymati o'zgarganda
  watch(searchValue, (newValue) => {
    // URL'ni yangilash
    updateURL(newValue);
    
    // Debounced search'ni chaqirish
    debouncedSearch(newValue);
  });
  
  // URL query params o'zgarganda (browser back/forward)
  watch(() => route.query[queryKey], (newQueryValue) => {
    if (searchValue.value !== newQueryValue) {
      searchValue.value = newQueryValue || '';
    }
  });
  
  return {
    searchValue,
  };
}
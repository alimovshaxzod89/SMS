import { defineStore } from 'pinia';
import { getClasses, getClass } from '@/services/modules/classes/classes.service';
import { useCore } from '@/store/core.pinia';

export const useClassesStore = defineStore('classes', {
    state: () => ({
        // Sinflar ro'yxati
        classes: [],
        
        // Pagination ma'lumotlari
        pagination: {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            totalPages: 0,
        },
        
        // Qidiruv so'zi
        searchQuery: '',
        
        // Filterlar
        filters: {
            gradeId: null,
            supervisorId: null,
        },
        
        // Loading holati
        loading: false,
        
        // Tanlangan sinf (bitta sinf ma'lumotlari)
        selectedClass: null,
    }),
    
    getters: {
        // Sinflar ro'yxatini qaytarish
        getClasses: (state) => state.classes,
        
        // Loading holatini qaytarish
        isLoading: (state) => state.loading,
        
        // Tanlangan sinfni qaytarish
        getSelectedClass: (state) => state.selectedClass,
    },
    
    actions: {
        /**
         * Barcha sinflarni yuklash
         * @param {Object} options - Qo'shimcha parametrlar
         */
        async fetchClasses(options = {}) {
            this.loading = true;
            const core = useCore();
            
            try {
                // Service'dan sinflarni olish
                const result = await getClasses({
                    page: options.page || this.pagination.currentPage,
                    limit: options.pageSize || this.pagination.pageSize,
                    search: options.search || this.searchQuery,
                    gradeId: options.gradeId || this.filters.gradeId,
                    supervisorId: options.supervisorId || this.filters.supervisorId,
                });
                
                if (result.success) {
                    // State'ni yangilash
                    this.classes = result.data;
                    this.pagination = {
                        currentPage: result.currentPage,
                        pageSize: options.pageSize || this.pagination.pageSize,
                        total: result.count,
                        totalPages: result.totalPages,
                    };
                } else {
                    // Xatolik bo'lsa
                    core.setToast({
                        type: 'error',
                        message: result.error,
                    });
                    this.classes = [];
                }
            } catch (error) {
                core.setToast({
                    type: 'error',
                    message: 'Sinflarni yuklashda xatolik yuz berdi',
                });
                this.classes = [];
            } finally {
                this.loading = false;
            }
        },
        
        /**
         * Bitta sinfni ID bo'yicha olish
         * @param {string} id - Sinf ID
         */
        async fetchClass(id) {
            this.loading = true;
            const core = useCore();
            
            try {
                const result = await getClass(id);
                
                if (result.success) {
                    this.selectedClass = result.data;
                } else {
                    core.setToast({
                        type: 'error',
                        message: result.error,
                    });
                    this.selectedClass = null;
                }
            } catch (error) {
                core.setToast({
                    type: 'error',
                    message: 'Sinfni yuklashda xatolik yuz berdi',
                });
                this.selectedClass = null;
            } finally {
                this.loading = false;
            }
        },
        
    },
});


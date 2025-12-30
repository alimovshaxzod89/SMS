import { defineStore } from 'pinia';
import { useCore } from '@/store/core.pinia';
import { getExam, getExams } from '@/services/modules/exams/exams.service';

export const useExamsStore = defineStore('exams', {
    state: () => ({
        // Exams ro'yxati
        exams: [],
        
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
            subjectId: null,
        },
        
        // Loading holati
        loading: false,
        
        // Tanlangan exam (bitta exam ma'lumotlari)
        selectedExam: null,
    }),
    
    getters: {
        // Exams ro'yxatini qaytarish
        getExams: (state) => state.exams,
        
        // Loading holatini qaytarish
        isLoading: (state) => state.loading,
        
        // Tanlangan exam qaytarish
        getSelectedExam: (state) => state.selectedExam,
    },
    
    actions: {
        /**
         * Barcha exams yuklash
         * @param {Object} options - Qo'shimcha parametrlar
         */
        async fetchExams(options = {}) {
            this.loading = true;
            const core = useCore();
            
            try {
                // Service'dan exams olish
                const result = await getExams({
                    page: options.page || this.pagination.currentPage,
                    limit: options.pageSize || this.pagination.pageSize,
                    search: options.search || this.searchQuery,
                });
                
                if (result.success) {
                    // State'ni yangilash
                    this.exams = result.data;
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
                    this.exams = [];
                }
            } catch (error) {
                core.setToast({
                    type: 'error',
                    message: 'Exams yuklashda xatolik yuz berdi',
                });
                this.exams = [];
            } finally {
                this.loading = false;
            }
        },
        
        /**
         * Bitta exam ID bo'yicha olish
         * @param {string} id - Exam ID
         */
        async fetchExam(id) {
            this.loading = true;
            const core = useCore();
            
            try {
                const result = await getExam(id);
                
                if (result.success) {
                    this.selectedExam = result.data;
                } else {
                    core.setToast({
                        type: 'error',
                        message: result.error,
                    });
                    this.selectedExam = null;
                }
            } catch (error) {
                core.setToast({
                    type: 'error',
                    message: 'Exam yuklashda xatolik yuz berdi',
                });
                this.selectedExam = null;
            } finally {
                this.loading = false;
            }
        },
        
    },
});
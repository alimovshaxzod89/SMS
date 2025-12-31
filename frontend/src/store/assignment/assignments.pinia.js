import { defineStore } from 'pinia';
import { useCore } from '@/store/core.pinia';
import { getAssignments, getAssignment } from '@/services/modules/assignments/assignments.service';

export const useAssignmentsStore = defineStore('assignments', {
    state: () => ({
        // Topshirqlar ro'yxati
        assignments: [],
        
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
        
        // Tanlangan topshiriq (bitta topshiriq ma'lumotlari)
        selectedAssignment: null,
    }),
    
    getters: {
        // Topshiriqlar ro'yxatini qaytarish
        getAssignments: (state) => state.assignments,
        
        // Loading holatini qaytarish
        isLoading: (state) => state.loading,
        
        // Tanlangan topshiriqni qaytarish
        getSelectedAssignment: (state) => state.selectedAssignment,
    },
    
    actions: {
        /**
         * Barcha topshiriqlarni yuklash
         * @param {Object} options - Qo'shimcha parametrlar
         */
        async fetchAssignments(options = {}) {
            this.loading = true;
            const core = useCore();
            
            try {
                // Service'dan topshiriqlarni olish
                const result = await getAssignments({
                    page: options.page || this.pagination.currentPage,
                    limit: options.pageSize || this.pagination.pageSize,
                    search: options.search || this.searchQuery,
                });
                
                if (result.success) {
                    // State'ni yangilash
                    this.assignments = result.data;
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
                    this.assignments = [];
                }
            } catch (error) {
                core.setToast({
                    type: 'error',
                    message: 'Topsiriqlarni yuklashda xatolik yuz berdi',
                });
                this.assignments = [];
            } finally {
                this.loading = false;
            }
        },
        
        /**
         * Bitta topshiriqni ID bo'yicha olish
         * @param {string} id - Topsiriq ID
         */
        async fetchAssignment(id) {
            this.loading = true;
            const core = useCore();
            
            try {
                const result = await getAssignment(id);
                
                if (result.success) {
                    this.selectedAssignment = result.data;
                } else {
                    core.setToast({
                        type: 'error',
                        message: result.error,
                    });
                    this.selectedAssignment = null;
                }
            } catch (error) {
                core.setToast({
                    type: 'error',
                    message: 'Topsiriqni yuklashda xatolik yuz berdi',
                });
                this.selectedAssignment = null;
            } finally {
                this.loading = false;
            }
        },
        
    },
});
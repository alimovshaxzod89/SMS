import { defineStore } from 'pinia';
import { useCore } from '@/store/core.pinia';
import { getParents, getParent } from '@/services/modules/parents/parents.service';

export const useParentsStore = defineStore('parents', {
    state: () => ({
        // O'qituvchilar ro'yxati
        parents: [],
        
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
        },
        
        // Loading holati
        loading: false,
        
        // Tanlangan ota-ona (bitta ota-ona ma'lumotlari)
        selectedParent: null,
    }),
    
    getters: {
        // Ota-onalar ro'yxatini qaytarish
        getParents: (state) => state.parents,
        
        // Loading holatini qaytarish
        isLoading: (state) => state.loading,
        
        // Tanlangan ota-onani qaytarish
        getSelectedParent: (state) => state.selectedParent,
    },
    
    actions: {
        /**
         * Barcha ota-onalarni yuklash
         * @param {Object} options - Qo'shimcha parametrlar
         */
        async fetchParents(options = {}) {
            this.loading = true;
            const core = useCore();
            
            try {
                // Service'dan ota-onalarni olish
                const result = await getParents({
                    page: options.page || this.pagination.currentPage,
                    limit: options.pageSize || this.pagination.pageSize,
                    search: options.search || this.searchQuery,
                });
                
                if (result.success) {
                    // State'ni yangilash
                    this.parents = result.data;
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
                    this.parents = [];
                }
            } catch (error) {
                core.setToast({
                    type: 'error',
                    message: 'Ota-onalarni yuklashda xatolik yuz berdi',
                });
                this.parents = [];
            } finally {
                this.loading = false;
            }
        },
        
        /**
         * Bitta ota-onani ID bo'yicha olish
         * @param {string} id - Ota-ona ID
         */
        async fetchParent(id) {
            this.loading = true;
            const core = useCore();
            
            try {
                const result = await getParent(id);
                
                if (result.success) {
                    this.selectedParent = result.data;
                } else {
                    core.setToast({
                        type: 'error',
                        message: result.error,
                    });
                    this.selectedParent = null;
                }
            } catch (error) {
                core.setToast({
                    type: 'error',
                    message: 'Ota-onani yuklashda xatolik yuz berdi',
                });
                this.selectedParent = null;
            } finally {
                this.loading = false;
            }
        },
        
    },
});
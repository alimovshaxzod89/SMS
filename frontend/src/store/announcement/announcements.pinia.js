import { defineStore } from 'pinia';
import { getAnnouncements, getAnnouncement } from '@/services/modules/announcements/announcements.service';
import { useCore } from '@/store/core.pinia';
import dayjs from 'dayjs';

export const useAnnouncementsStore = defineStore('announcements', {
    state: () => ({
        // E'lonlar ro'yxati
        announcements: [],
        
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
            classId: null,
            date: null,
        },
        
        // Loading holati
        loading: false,
        
        // Tanlangan e'lon (bitta e'lon ma'lumotlari)
        selectedAnnouncement: null,
    }),
    
    getters: {
        // E'lonlar ro'yxatini qaytarish
        getAnnouncements: (state) => state.announcements,
        
        // Eng so'nggi e'lonlar (dashboard uchun)
        getLatestAnnouncements: (state) => (limit = 4) => {
            return state.announcements.slice(0, limit);
        },
        
        // Loading holatini qaytarish
        isLoading: (state) => state.loading,
        
        // E'lonlar sonini qaytarish
        getAnnouncementsCount: (state) => state.announcements.length,
    },
    
    actions: {
        /**
         * Barcha e'lonlar ro'yxatini yuklash
         * @param {Object} options - Qo'shimcha parametrlar
         */
        async fetchAnnouncements(options = {}) {
            this.loading = true;
            const core = useCore();
            
            try {
                // Service'dan e'lonlar ro'yxatini olish
                const result = await getAnnouncements({
                    page: options.page || this.pagination.currentPage,
                    limit: options.pageSize || this.pagination.pageSize,
                    search: options.search || this.searchQuery,
                    classId: options.classId || this.filters.classId,
                    date: options.date || this.filters.date,
                });
                
                if (result.success) {
                    // State'ni yangilash
                    this.announcements = result.data;
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
                    this.announcements = [];
                }
            } catch (error) {
                core.setToast({
                    type: 'error',
                    message: 'E\'lonlar ro\'yxatini yuklashda xatolik yuz berdi',
                });
                this.announcements = [];
            } finally {
                this.loading = false;
            }
        },

        /**
         * Eng so'nggi e'lonlarni yuklash (dashboard uchun)
         * @param {number} limit - E'lonlar soni (default: 4)
         */
        async fetchLatestAnnouncements(limit = 4) {
            await this.fetchAnnouncements({
                page: 1,
                pageSize: limit,
            });
        },
        
        /**
         * Bitta e'lonni ID bo'yicha olish
         * @param {string} id - E'lon ID
         */
        async fetchAnnouncement(id) {
            this.loading = true;
            const core = useCore();
            
            try {
                const result = await getAnnouncement(id);
                
                if (result.success) {
                    this.selectedAnnouncement = result.data;
                } else {
                    core.setToast({
                        type: 'error',
                        message: result.error,
                    });
                    this.selectedAnnouncement = null;
                }
            } catch (error) {
                core.setToast({
                    type: 'error',
                    message: 'E\'lonni yuklashda xatolik yuz berdi',
                });
                this.selectedAnnouncement = null;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Filterlarni o'rnatish
         * @param {Object} filters - Filter obyekti
         */
        setFilters(filters) {
            this.filters = { ...this.filters, ...filters };
        },

        /**
         * Filterlarni tozalash
         */
        clearFilters() {
            this.filters = {
                classId: null,
                date: null,
            };
        },

        /**
         * Qidiruv so'zini o'rnatish
         * @param {string} searchQuery - Qidiruv so'zi
         */
        setSearchQuery(searchQuery) {
            this.searchQuery = searchQuery;
        },

        /**
         * State'ni tozalash
         */
        clearAnnouncements() {
            this.announcements = [];
            this.selectedAnnouncement = null;
            this.pagination = {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                totalPages: 0,
            };
        },
    },
});
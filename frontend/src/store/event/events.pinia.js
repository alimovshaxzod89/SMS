import { defineStore } from 'pinia';
import { getEvents, getEvent } from '@/services/modules/event/events.service';
import { useCore } from '@/store/core.pinia';
import dayjs from 'dayjs';

export const useEventsStore = defineStore('events', {
    state: () => ({
        // Tadbirlar ro'yxati
        events: [],
        
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
        filters: {},
        
        // Loading holati
        loading: false,
        
        // Tanlangan tadbir (bitta tadbir ma'lumotlari)
        selectedEvent: null,

        // Tanlangan sana (calendar uchun)
        selectedDate: null,
    }),
    
    getters: {
        // Tadbirlar ro'yxatini qaytarish
        getEvents: (state) => state.events,

        // Tanlangan sana bo'yicha filtered tadbirlar
        getFilteredEventsByDate: (state) => {
            // return state.events
            return (date) => {
                // 1. Agar date berilmagan bo'lsa, barcha tadbirlarni qaytar
                if (!date) {
                    return state.events;
                }
                // 2. date'ni dayjs obyektiga aylantirish
                const selectedDate = dayjs(date);
                
                // 3. state.events massividan filter qilish
                return state.events.filter(event => {
                    // 4. Agar event'da startTime yo'q bo'lsa, o'tkazib yuborish
                    if (!event.startTime) return false;
                    
                    // 5. Event sanasini dayjs obyektiga aylantirish
                    const eventDate = dayjs(event.startTime);
                    // 6. Event sanasi tanlangan sana bilan bir xil kun bo'lsa, qaytarish
                    return eventDate.isSame(selectedDate, 'day');
                });
            }
        },
        
        // Loading holatini qaytarish
        isLoading: (state) => state.loading,
        
        // Tanlangan tadbirni qaytarish
        getSelectedEvent: (state) => state.selectedEvent,
    },
    
    actions: {
        /**
         * Barcha tadbirlar ro'yxatini yuklash
         * @param {Object} options - Qo'shimcha parametrlar
         */
        async fetchEvents(options = {}) {
            this.loading = true;
            const core = useCore();
            
            try {
                // Service'dan tadbirlar ro'yxatini olish
                const result = await getEvents({
                    page: options.page || this.pagination.currentPage,
                    limit: options.pageSize || this.pagination.pageSize,
                    search: options.search || this.searchQuery,
                    startDate: options.startDate || null,
                    endDate: options.endDate || null,
                });
                
                if (result.success) {
                    // State'ni yangilash
                    this.events = result.data;
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
                    this.events = [];
                }
            } catch (error) {
                core.setToast({
                    type: 'error',
                    message: 'Tadbirlar ro\'yxatini yuklashda xatolik yuz berdi',
                });
                this.events = [];
            } finally {
                this.loading = false;
            }
        },

        /**
         * Oylik tadbirlar ro'yxatini yuklash
         * @param {Date|string|dayjs.Dayjs} date - Oydagi istalgan sana
         */
        async fetchEventsByMonth(date) {
            if (!date) {
                await this.fetchEvents();
                return;
            }

            const selectedDate = dayjs(date);
            const startDate = selectedDate.startOf('month').toISOString();
            const endDate = selectedDate.endOf('month').toISOString();

            await this.fetchEvents({
                startDate,
                endDate,
                limit: 500, // Oylik ma'lumot uchun yanada ko'proq
            });
        },

        /**
         * Tanlangan sanani o'rnatish
         * @param {Date|string|dayjs.Dayjs|null} date - Tanlangan sana
         */
        setSelectedDate(date) {
            this.selectedDate = date ? dayjs(date).toDate() : null;
        },

        /**
         * Tanlangan sanani tozalash
         */
        clearSelectedDate() {
            this.selectedDate = null;
        },
        
        /**
         * Bitta tadbirni ID bo'yicha olish
         * @param {string} id - Tadbir ID
         */
        async fetchEvent(id) {
            this.loading = true;
            const core = useCore();
            
            try {
                const result = await getEvent(id);
                
                if (result.success) {
                    this.selectedEvent = result.data;
                } else {
                    core.setToast({
                        type: 'error',
                        message: result.error,
                    });
                    this.selectedEvent = null;
                }
            } catch (error) {
                core.setToast({
                    type: 'error',
                    message: 'Tadbirni yuklashda xatolik yuz berdi',
                });
                this.selectedEvent = null;
            } finally {
                this.loading = false;
            }
        },
        
    },
});
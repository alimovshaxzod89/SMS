import { defineStore } from 'pinia';
import { getDashboardStatistics, getUserCount, getStudentsCountStatistics } from '@/services/modules/statistics/statistics.service';
import { useCore } from '@/store/core.pinia';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    // User statistikalari
    statistics: {
      admin: 1,
      student: 0,
      teacher: 0,
      parent: 0,
    },
    
    // Loading holati
    loading: false,
    
    // Xatolik holati
    error: null,
    
    // Oxirgi yangilanish vaqti
    lastUpdated: null,

    // Student gender statistikalari
    studentsCountStats: {
      boys: 0,
      girls: 0,
      total: 0,
    },
    studentsCountLoading: false,
    studentsCountLastUpdated: null,
  }),
  
  getters: {
    // Barcha statistikalarni olish
    getStatistics: (state) => state.statistics,
    
    // Bitta user tipining countini olish
    getUserCount: (state) => (type) => {
      return state.statistics[type] || 0;
    },
    
    // Jami userlar soni
    getTotalUsers: (state) => {
      return state.statistics.admin + 
             state.statistics.student + 
             state.statistics.teacher + 
             state.statistics.parent;
    },
    // Student gender statistikalari
    getStudentsCountStats: (state) => state.studentsCountStats,
    getBoysCount: (state) => state.studentsCountStats.boys,
    getGirlsCount: (state) => state.studentsCountStats.girls,
    getTotalStudentsCount: (state) => state.studentsCountStats.total,
    isStudentsCountLoading: (state) => state.studentsCountLoading,

    // Loading holatini olish
    isLoading: (state) => state.loading,
    
    // Xatolikni olish
    getError: (state) => state.error,
    
  },
  
  actions: {
    /**
     * Dashboard statistikalarini yuklash
     * @param {boolean} forceRefresh - Force refresh qilish (cache'ni e'tiborsiz qoldirish)
     */
    async fetchStatistics(forceRefresh = false) {
      // Agar oxirgi yangilanish 1 daqiqadan kam vaqt oldin bo'lgan bo'lsa va force refresh bo'lmasa, cache'dan qaytarish
      if (!forceRefresh && this.lastUpdated) {
        const now = new Date();
        const lastUpdate = new Date(this.lastUpdated);
        const diffMinutes = (now - lastUpdate) / (1000 * 60);
        
        if (diffMinutes < 1) {
          // 1 daqiqadan kam vaqt o'tgan, cache'dan qaytarish
          return;
        }
      }
      
      this.loading = true;
      this.error = null;
      const core = useCore();
      
      try {
        // Service'dan statistikalarni olish
        const result = await getDashboardStatistics();
        
        if (result.success) {
          // State'ni yangilash
          this.statistics = result.data;
          this.lastUpdated = new Date().toISOString();
          this.error = null;
        } else {
          // Xatolik bo'lsa
          this.error = result.error;
          core.setToast({
            type: 'error',
            message: result.error || 'Statistikalarni yuklashda xatolik yuz berdi',
          });
        }
      } catch (error) {
        // Catch block - kutilmagan xatolik
        this.error = 'Statistikalarni yuklashda kutilmagan xatolik yuz berdi';
        core.setToast({
          type: 'error',
          message: 'Statistikalarni yuklashda xatolik yuz berdi',
        });
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Bitta user tipining countini yangilash
     * @param {string} userType - 'student', 'teacher', 'parent', 'admin'
     */
    async refreshUserCount(userType) {
      this.loading = true;
      const core = useCore();
      
      try {
        const result = await getUserCount(userType);
        
        if (result.success) {
          // Faqat shu tipni yangilash
          this.statistics[userType] = result.data.count;
          this.lastUpdated = new Date().toISOString();
        } else {
          core.setToast({
            type: 'error',
            message: result.error || `${userType} sonini yangilashda xatolik`,
          });
        }
      } catch (error) {
        core.setToast({
          type: 'error',
          message: `${userType} sonini yangilashda xatolik yuz berdi`,
        });
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Statistikani tozalash (logout yoki component unmount bo'lganda)
     */
    clearStatistics() {
      this.statistics = {
        admin: 1,  // State bilan moslash
        student: 0,
        teacher: 0,
        parent: 0,
      };
      this.lastUpdated = null;
      this.error = null;
      // Student gender stats'ni ham tozalash
      this.studentsCountStats = {
        boys: 0,
        girls: 0,
        total: 0,
      };
      this.studentsCountLastUpdated = null;
    },

    /**
     * O'quvchilar sonini yuklash
     * @param {boolean} forceRefresh - Force refresh qilish (cache'ni e'tiborsiz qoldirish)
     */
    async fetchStudentsCountStatistics(forceRefresh = false) {
      // Cache check
      if (!forceRefresh && this.studentsCountLastUpdated) {
        const now = new Date();
        const lastUpdate = new Date(this.studentsCountLastUpdated);
        const diffMinutes = (now - lastUpdate) / (1000 * 60);
        if (diffMinutes < 1) return;
      }
      
      this.studentsCountLoading = true;
      const core = useCore();
      
      try {
        const result = await getStudentsCountStatistics();
        if (result.success) {
          this.studentsCountStats = result.data;
          this.studentsCountLastUpdated = new Date().toISOString();
        } else {
          core.setToast({
            type: 'error',
            message: result.error || 'O\'quvchilar statistikasini yuklashda xatolik',
          });
        }
      } catch (error) {
        core.setToast({
          type: 'error',
          message: 'O\'quvchilar statistikasini yuklashda kutilmagan xatolik',
        });
      } finally {
        this.studentsCountLoading = false;
      }
    },
  },
});

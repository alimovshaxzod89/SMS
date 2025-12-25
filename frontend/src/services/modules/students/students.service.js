import api from '@/utils/api';
import { useCore } from '@/store/core.pinia';

const core = useCore();

/**
 * Barcha o'quvchilarni olish (pagination va search bilan)
 * @param {Object} params - Query parametrlar
 * @param {number} params.page - Sahifa raqami (default: 1)
 * @param {number} params.limit - Har bir sahifadagi elementlar soni (default: 10)
 * @param {string} params.search - Qidiruv so'zi (name, surname, email, username bo'yicha)
 * @param {string} params.classId - Class ID bo'yicha filter
 * @param {string} params.gradeId - Grade ID bo'yicha filter
 * @param {string} params.sex - Sex bo'yicha filter
 * @returns {Promise} API javobi
 */

export const getStudents = async (params = {}) => {
    const loadingUrl = 'getStudents';
    
    try {
      // Loading holatini yoqish
      core.addLoadingUrl(loadingUrl);
      
      // API so'rovini yuborish
      const response = await api.get('/students', {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || '',
          classId: params.classId || '',
          gradeId: params.gradeId || '',
          sex: params.sex || '',
        }
      });
      
      // Muvaffaqiyatli javobni qaytarish
      return {
        success: true,
        data: response.data.data, // O'quvchilar ro'yxati
        count: response.data.count, // Jami soni
        totalPages: response.data.totalPages, // Jami sahifalar soni
        currentPage: response.data.currentPage, // Hozirgi sahifa
      };
    } catch (error) {
      // Xatolik bo'lsa
      return {
        success: false,
        error: error.response?.data?.error || 'O\'quvchilarni olishda xatolik yuz berdi',
        data: [],
        count: 0,
        totalPages: 0,
        currentPage: 1,
      };
    } finally {
      // Loading holatini o'chirish
      core.removeLoadingUrl(loadingUrl);
    }
};

/**
 * Bitta o'quvchini ID bo'yicha olish
 * @param {string} id - O'quvchi ID (MongoDB ObjectId yoki custom id)
 * @returns {Promise} API javobi
 */
export const getStudent = async (id) => {
    const loadingUrl = `getStudent-${id}`;
    
    try {
      core.addLoadingUrl(loadingUrl);
      const response = await api.get(`/students/${id}`);
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'O\'quvchini olishda xatolik yuz berdi',
        data: null,
      };
    } finally {
      core.removeLoadingUrl(loadingUrl);
    }
  };
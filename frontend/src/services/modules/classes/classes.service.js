import api from '@/utils/api';
import { useCore } from '@/store/core.pinia';

const core = useCore();

/**
 * Barcha sinflarni olish (pagination va search bilan)
 * @param {Object} params - Query parametrlar
 * @param {number} params.page - Sahifa raqami (default: 1)
 * @param {number} params.limit - Har bir sahifadagi elementlar soni (default: 10)
 * @param {string} params.search - Qidiruv so'zi (name bo'yicha)
 * @param {string} params.gradeId - Daraja ID bo'yicha filter
 * @param {string} params.supervisorId - O'qituvchi ID bo'yicha filter
 * @returns {Promise} API javobi
 */
export const getClasses = async (params = {}) => {
  const loadingUrl = 'getClasses';
  
  try {
    // Loading holatini yoqish
    core.addLoadingUrl(loadingUrl);
    
    // API so'rovini yuborish
    const response = await api.get('/classes', {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || '',
        gradeId: params.gradeId || '',
        supervisorId: params.supervisorId || '',
      }
    });
    
    // Muvaffaqiyatli javobni qaytarish
    return {
      success: true,
      data: response.data.data, // Sinflar ro'yxati
      count: response.data.count, // Jami soni
      totalPages: response.data.totalPages, // Jami sahifalar soni
      currentPage: response.data.currentPage, // Hozirgi sahifa
    };
  } catch (error) {
    // Xatolik bo'lsa
    return {
      success: false,
      error: error.response?.data?.error || 'Sinflarni olishda xatolik yuz berdi',
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
 * Bitta sinfni ID bo'yicha olish
 * @param {string} id - Sinf ID (MongoDB ObjectId)
 * @returns {Promise} API javobi
 */
export const getClass = async (id) => {
  const loadingUrl = `getClass-${id}`;
  
  try {
    core.addLoadingUrl(loadingUrl);
    const response = await api.get(`/classes/${id}`);
    
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Sinfni olishda xatolik yuz berdi',
      data: null,
    };
  } finally {
    core.removeLoadingUrl(loadingUrl);
  }
};


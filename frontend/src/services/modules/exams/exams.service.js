import api from '@/utils/api';
import { useCore } from '@/store/core.pinia';

const core = useCore();

/**
 * Barcha exams olish (pagination va search bilan)
 * @param {Object} params - Query parametrlar
 * @param {number} params.page - Sahifa raqami (default: 1)
 * @param {number} params.limit - Har bir sahifadagi elementlar soni (default: 10)
 * @param {string} params.search - Qidiruv so'zi (name, surname, email, username bo'yicha)
 * @param {string} params.subjectId - Fan ID bo'yicha filter
 * @returns {Promise} API javobi
 */
export const getExams = async (params = {}) => {
  const loadingUrl = 'getExams';
  
  try {
    // Loading holatini yoqish
    core.addLoadingUrl(loadingUrl);
    
    // API so'rovini yuborish
    const response = await api.get('/exams', {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || '',
      }
    });
    
    // Muvaffaqiyatli javobni qaytarish
    return {
      success: true,
      data: response.data.data, // Exams ro'yxati
      count: response.data.count, // Jami soni
      totalPages: response.data.totalPages, // Jami sahifalar soni
      currentPage: response.data.currentPage, // Hozirgi sahifa
    };
  } catch (error) {
    // Xatolik bo'lsa
    return {
      success: false,
      error: error.response?.data?.error || 'Exams olishda xatolik yuz berdi',
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
 * Bitta exam ID bo'yicha olish
 * @param {string} id - Exam ID (MongoDB ObjectId yoki custom id)
 * @returns {Promise} API javobi
 */
export const getExam = async (id) => {
  const loadingUrl = `getExam-${id}`;
  
  try {
    core.addLoadingUrl(loadingUrl);
    const response = await api.get(`/exams/${id}`);
    
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Exam olishda xatolik yuz berdi',
      data: null,
    };
  } finally {
    core.removeLoadingUrl(loadingUrl);
  }
};
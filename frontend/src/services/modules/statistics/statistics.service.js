import api from '@/utils/api';
import { useCore } from '@/store/core.pinia';

/**
 * Dashboard statistikalarini olish
 * Barcha user tiplarining countlarini bir vaqtda olish
 * @returns {Promise} API javobi - {admin: number, student: number, teacher: number, parent: number}
 */
export const getDashboardStatistics = async () => {
  const core = useCore();
  const loadingUrl = 'getDashboardStatistics';
  
  try {
    // Loading holatini yoqish
    core.addLoadingUrl(loadingUrl);
    
    // Barcha API so'rovlarni parallel ravishda yuborish (performance optimization)
    const [studentsRes, teachersRes, parentsRes] = await Promise.allSettled([
      api.get('/students', { params: { page: 1, limit: 1 } }),
      api.get('/teachers', { params: { page: 1, limit: 1 } }),
      api.get('/parents', { params: { page: 1, limit: 1 } })
    ]);
    
    // Har bir response'dan count olish
    const statistics = {
      admin: 1,
      student: studentsRes.status === 'fulfilled' 
        ? studentsRes.value.data?.count || 0 
        : 0,
      teacher: teachersRes.status === 'fulfilled' 
        ? teachersRes.value.data?.count || 0 
        : 0,
      parent: parentsRes.status === 'fulfilled' 
        ? parentsRes.value.data?.count || 0 
        : 0,
    };
    
    // Muvaffaqiyatli javobni qaytarish
    return {
      success: true,
      data: statistics,
    };
  } catch (error) {
    // Xatolik bo'lsa
    return {
      success: false,
      error: error.response?.data?.error || 'Statistikalarni olishda xatolik yuz berdi',
      data: {
        admin: 0,
        student: 0,
        teacher: 0,
        parent: 0,
      },
    };
  } finally {
    // Loading holatini o'chirish
    core.removeLoadingUrl(loadingUrl);
  }
};

/**
 * Faqat bitta user tipining countini olish
 * @param {string} userType - 'student', 'teacher', 'parent', 'admin'
 * @returns {Promise} API javobi
 */
export const getUserCount = async (userType) => {
  const core = useCore();
  const loadingUrl = `getUserCount-${userType}`;
  
  try {
    core.addLoadingUrl(loadingUrl);
    
    let endpoint = '';
    switch (userType) {
      case 'student':
        endpoint = '/students';
        break;
      case 'teacher':
        endpoint = '/teachers';
        break;
      case 'parent':
        endpoint = '/parents';
        break;
      default:
        throw new Error(`Noma'lum user tipi: ${userType}`);
    }
    
    const response = await api.get(endpoint, { 
      params: { page: 1, limit: 1 } 
    });
    
    return {
      success: true,
      data: {
        type: userType,
        count: response.data?.count || 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || `${userType} sonini olishda xatolik`,
      data: {
        type: userType,
        count: 0,
      },
    };
  } finally {
    core.removeLoadingUrl(loadingUrl);
  }
};

/**
 * O'quvchilarni jins bo'yicha statistikalarni olish
 * O'g'il va qiz bolalar sonini bir vaqtda olish
 * @returns {Promise} API javobi - {boys: number, girls: number, total: number}
 */
export const getStudentsCountStatistics = async () => {
  const core = useCore();
  const loadingUrl = 'getStudentsCountStatistics';
  
  try {
    core.addLoadingUrl(loadingUrl);
    
    // Parallel API so'rovlar - performance optimization
    const [boysRes, girlsRes] = await Promise.allSettled([
      api.get('/students', { params: { page: 1, limit: 1, sex: 'male' } }),
      api.get('/students', { params: { page: 1, limit: 1, sex: 'female' } })
    ]);
    
    const boysCount = boysRes.status === 'fulfilled' 
      ? boysRes.value.data?.count || 0 
      : 0;
    
    const girlsCount = girlsRes.status === 'fulfilled' 
      ? girlsRes.value.data?.count || 0 
      : 0;
    
    return {
      success: true,
      data: {
        boys: boysCount,
        girls: girlsCount,
        total: boysCount + girlsCount,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'O\'quvchilar statistikasini olishda xatolik yuz berdi',
      data: { boys: 0, girls: 0, total: 0 },
    };
  } finally {
    core.removeLoadingUrl(loadingUrl);
  }
};

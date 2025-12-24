/**
 * Debounce funksiyasi - funksiyani belgilangan vaqtdan keyin chaqiradi
 * @param {Function} func - Bajariladigan funksiya
 * @param {number} wait - Kutiladigan vaqt (millisekundlarda)
 * @param {boolean} immediate - Darhol bajarish kerakmi
 * @returns {Function} Debounced funksiya
 */
export function debounce(func, wait = 300, immediate = false) {
    let timeout;
    
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      
      const callNow = immediate && !timeout;
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      
      if (callNow) func(...args);
    };
  }
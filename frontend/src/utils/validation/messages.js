/**
 * Markazlashtirilgan validatsiya xabarlari
 */
export const ValidationMessages = {
  // Umumiy xabarlar
  required: (fieldName) => `${fieldName} kiritilishi shart`,

  // String validatsiyalari
  minLength: (fieldName, min) => `${fieldName} kamida ${min} ta belgi bo'lishi kerak`,
  maxLength: (fieldName, max) => `${fieldName} ko'pi bilan ${max} ta belgi bo'lishi kerak`,

  // Email
  email: () => `Email formati noto'g'ri`,

  // Telefon
  phone: () => `Telefon raqami noto'g'ri formatda`,

  // Array
  arrayRequired: (fieldName) => `Kamida bitta ${fieldName} tanlang`,
  arrayMin: (fieldName, min) => `Kamida ${min} ta ${fieldName} tanlang`,
  arrayMax: (fieldName, max) => `Ko'pi bilan ${max} ta ${fieldName} tanlash mumkin`,

  // Raqamlar
  number: (fieldName) => `${fieldName} raqam bo'lishi kerak`,
  min: (fieldName, min) => `${fieldName} kamida ${min} bo'lishi kerak`,
  max: (fieldName, max) => `${fieldName} ko'pi bilan ${max} bo'lishi kerak`,

  // Sana
  date: (fieldName) => `${fieldName} sana formatida bo'lishi kerak`,
  dateBefore: (fieldName, before) => `${fieldName} ${before} dan oldin bo'lishi kerak`,
  dateAfter: (fieldName, after) => `${fieldName} ${after} dan keyin bo'lishi kerak`,

  // Pattern
  pattern: (fieldName) => `${fieldName} noto'g'ri formatda`,
};
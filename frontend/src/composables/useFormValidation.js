/**
 * Form validatsiya composable
 * Barcha formlarda qayta ishlatiluvchi logika
 */
import { ref, watch } from 'vue';

/**
 * Form validatsiya va state boshqaruvi uchun composable
 * @param {Object} options - Konfiguratsiya
 * @param {Object} options.schema - Validatsiya schemasi
 * @param {Object} options.initialState - Boshlang'ich form state
 * @param {Function} options.mapToFormState - Ma'lumotni form state ga aylantiruvchi funksiya
 */
export function useFormValidation({ schema, initialState, mapToFormState }) {
  // Form ref
  const formRef = ref(null);

  // Form state
  const formState = ref({ ...initialState });

  // Validatsiya qoidalari
  const rules = schema;

  /**
   * Formani boshlang'ich holatga qaytarish
   */
  const resetForm = () => {
    formState.value = { ...initialState };
    formRef.value?.resetFields();
  };

  /**
   * Form state ni ma'lumot bilan to'ldirish
   * @param {Object} data - Ma'lumot
   */
  const populateForm = (data) => {
    if (data && Object.keys(data).length > 0) {
      formState.value = mapToFormState(data);
    } else {
      resetForm();
    }
  };

  /**
   * Formani validatsiya qilish
   * @returns {Promise<boolean>}
   */
  const validate = async () => {
    try {
      await formRef.value?.validate();
      return true;
    } catch (error) {
      console.error('Form validation error:', error);
      return false;
    }
  };

  /**
   * Form submit handler yaratish
   * @param {Function} onSuccess - Muvaffaqiyatli submit callback
   */
  const createSubmitHandler = (onSuccess) => {
    return async () => {
      const isValid = await validate();
      if (isValid) {
        onSuccess(formState.value);
      }
    };
  };

  /**
   * Props watcher yaratish (mode va data uchun)
   * @param {Function} getProps - Props getter
   * @param {Object} options - Watcher options
   */
  const setupWatchers = (getProps, options = {}) => {
    const { dataKey = 'data', modeKey = 'mode' } = options;

    // Data o'zgarganda
    watch(
      () => getProps()[dataKey],
      (newData) => {
        populateForm(newData);
      },
      { immediate: true, deep: true }
    );

    // Mode o'zgarganda
    watch(
      () => getProps()[modeKey],
      (newMode) => {
        if (newMode === 'create') {
          resetForm();
        }
      }
    );
  };

  return {
    formRef,
    formState,
    rules,
    resetForm,
    populateForm,
    validate,
    createSubmitHandler,
    setupWatchers,
  };
}

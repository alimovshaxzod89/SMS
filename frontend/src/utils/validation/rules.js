/**
 * Qayta ishlatiluvchi validatsiya qoidalari
 * Ant Design Vue validation format bilan mos
 */
import { ValidationMessages } from './messages';

/**
 * Majburiy maydon qoidasi
 */
export const required = (fieldName) => ({
  required: true,
  message: ValidationMessages.required(fieldName),
  trigger: 'blur',
});

/**
 * Oddiy nom validatsiyasi (faqat harflar, raqamlar, bo'shliq, tire, apostrof)
 * Fan nomi, sinf nomi va shunga o'xshashlar uchun
 */
export const simpleName = (fieldName, { min = 2, max = 100 } = {}) => [
  required(fieldName),
  // TODO: To fix same message for min and max validation.
  {
    min,
    max,
    message: ValidationMessages.minLength(fieldName, min),
    trigger: 'blur',
  },
  {
    pattern: /^[a-zA-Z0-9\u0400-\u04FFʻʼ\s'-]+$/,
    message: `${fieldName} faqat harflar, raqamlar va bo'shliq bo'lishi mumkin`,
    trigger: 'blur',
  },
];

/**
 * Email validatsiyasi
 */
export const email = (fieldName = 'Email') => [
  required(fieldName),
  {
    type: 'email',
    message: ValidationMessages.email(),
    trigger: 'blur',
  },
];

/**
 * Telefon raqami validatsiyasi
 */
export const phone = (fieldName = 'Telefon') => [
  required(fieldName),
  {
    pattern: /^\+998[0-9]{9}$/,
    message: ValidationMessages.phone(),
    trigger: 'blur',
  },
];

/**
 * String uzunlik validatsiyasi
 */
export const stringLength = (fieldName, { min, max, isRequired = true } = {}) => {
  const rules = [];

  if (isRequired) {
    rules.push(required(fieldName));
  }

  if (min) {
    rules.push({
      min,
      message: ValidationMessages.minLength(fieldName, min),
      trigger: 'blur',
    });
  }

  if (max) {
    rules.push({
      max,
      message: ValidationMessages.maxLength(fieldName, max),
      trigger: 'blur',
    });
  }

  return rules;
};

/**
 * Array (multiple select) validatsiyasi
 */
export const arrayRequired = (fieldName, { min = 1, max } = {}) => {
  const rules = [
    {
      required: true,
      type: 'array',
      min,
      message: ValidationMessages.arrayMin(fieldName, min),
      trigger: 'change',
    },
  ];

  if (max) {
    rules.push({
      type: 'array',
      max,
      message: ValidationMessages.arrayMax(fieldName, max),
      trigger: 'change',
    });
  }

  return rules;
};

/**
 * Raqam validatsiyasi
 */
export const number = (fieldName, { min, max, isRequired = true } = {}) => {
  const rules = [];

  if (isRequired) {
    rules.push(required(fieldName));
  }

  rules.push({
    type: 'number',
    message: ValidationMessages.number(fieldName),
    trigger: 'blur',
  });

  if (min !== undefined) {
    rules.push({
      type: 'number',
      min,
      message: ValidationMessages.min(fieldName, min),
      trigger: 'blur',
    });
  }

  if (max !== undefined) {
    rules.push({
      type: 'number',
      max,
      message: ValidationMessages.max(fieldName, max),
      trigger: 'blur',
    });
  }

  return rules;
};

/**
 * Custom pattern validatsiyasi
 */
export const pattern = (fieldName, regex, { isRequired = true } = {}) => {
  const rules = [];

  if (isRequired) {
    rules.push(required(fieldName));
  }

  rules.push({
    pattern: regex,
    message: ValidationMessages.pattern(fieldName),
    trigger: 'blur',
  });

  return rules;
};

/**
 * Custom async validator
 */
export const asyncValidator = (fieldName, validatorFn) => ({
  validator: async (_, value) => {
    const result = await validatorFn(value);
    if (result.valid) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(result.message || ValidationMessages.pattern(fieldName)));
  },
  trigger: 'blur',
});
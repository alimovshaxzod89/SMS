/**
 * Result form validatsiya schemasi
 */
import { number } from '../rules';

/**
 * Form field nomlari (label uchun)
 */
export const ResultFieldNames = {
  score:     "Ball",
  studentId: "O'quvchi",
  examId:    "Imtihon",
};

/**
 * Result form validatsiya qoidalari
 */
export const ResultValidationSchema = {
  score:     number(ResultFieldNames.score, { min: 0, max: 100, isRequired: true }),
  studentId: [{ required: true, message: `${ResultFieldNames.studentId} tanlanishi shart`, trigger: 'change' }],
  examId:    [{ required: true, message: `${ResultFieldNames.examId} tanlanishi shart`, trigger: 'change' }],
};

/**
 * Bo'sh form state
 */
export const ResultInitialState = {
  score:     null,
  studentId: null,
  examId:    null,
};

/**
 * Result ma'lumotlarini form state ga aylantirish
 * @param {Object} result - Backend dan kelgan result
 * @returns {Object} Form state
 */
export const mapResultToFormState = (result) => {
  if (!result) return { ...ResultInitialState };

  const resolveId = (field) =>
    typeof field === "object" && field !== null
      ? field._id || field.id || null
      : field || null;

  return {
    score:     result.score ?? null,
    studentId: resolveId(result.studentId),
    examId:    resolveId(result.examId),
  };
};

export default {
  fieldNames:     ResultFieldNames,
  schema:         ResultValidationSchema,
  initialState:   ResultInitialState,
  mapToFormState: mapResultToFormState,
};

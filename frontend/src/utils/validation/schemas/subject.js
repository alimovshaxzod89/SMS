/**
 * Subject form validatsiya schemasi
 */
import { simpleName } from '../rules';

/**
 * Form field nomlari (label uchun)
 */
export const SubjectFieldNames = {
  name:     "Fan nomi",
  teachers: "O'qituvchi",
};

/**
 * Subject form validatsiya qoidalari
 */
export const SubjectValidationSchema = {
  name:     simpleName(SubjectFieldNames.name, { min: 2, max: 100 }),
  teachers: [],
};

/**
 * Bo'sh form state
 */
export const SubjectInitialState = {
  name:     "",
  teachers: [],
};

/**
 * Subject ma'lumotlarini form state ga aylantirish
 * @param {Object} subject - Backend dan kelgan subject
 * @returns {Object} Form state
 */
export const mapSubjectToFormState = (subject) => {
  if (!subject) return { ...SubjectInitialState };

  const resolveId = (field) =>
    typeof field === "object" && field !== null
      ? field._id || field.id || null
      : field || null;

  return {
    name:     subject.name || "",
    teachers: subject.teachers?.map(resolveId) || [],
  };
};

export default {
  fieldNames:     SubjectFieldNames,
  schema:         SubjectValidationSchema,
  initialState:   SubjectInitialState,
  mapToFormState: mapSubjectToFormState,
};

/**
 * Subject form validatsiya schemasi
 */
import { simpleName, arrayRequired } from '../rules';

/**
 * Form field nomlari (label uchun)
 */
export const SubjectFieldNames = {
  name: 'Fan nomi',
  teachers: "o'qituvchi",
};

/**
 * Subject form validatsiya qoidalari
 */
export const SubjectValidationSchema = {
  name: simpleName(SubjectFieldNames.name, { min: 2, max: 50 }),
  teachers: arrayRequired(SubjectFieldNames.teachers, { min: 1 }),
};

/**
 * Bo'sh form state
 */
export const SubjectInitialState = {
  name: '',
  teachers: [],
};

/**
 * Subject ma'lumotlarini form state ga aylantirish
 * @param {Object} subject - Backend dan kelgan subject
 * @returns {Object} Form state
 */
export const mapSubjectToFormState = (subject) => {
  if (!subject) return { ...SubjectInitialState };

  // Teachers array ichida object bo'lsa, ID ga aylantirish
  const teacherIds =
    subject.teachers?.map((teacher) => {
      if (typeof teacher === 'object' && teacher !== null) {
        return teacher._id || teacher.id;
      }
      return teacher;
    }) || [];

  return {
    name: subject.name || '',
    teachers: teacherIds,
  };
};

export default {
  fieldNames: SubjectFieldNames,
  schema: SubjectValidationSchema,
  initialState: SubjectInitialState,
  mapToFormState: mapSubjectToFormState,
};

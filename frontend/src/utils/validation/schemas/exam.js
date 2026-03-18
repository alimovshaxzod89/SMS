/**
 * Exam form validatsiya schemasi
 */
import { simpleName } from '../rules';
import dayjs from 'dayjs';

/**
 * Form field nomlari (label uchun)
 */
export const ExamFieldNames = {
  title:     "Imtihon nomi",
  startTime: "Boshlanish vaqti",
  endTime:   "Tugash vaqti",
  lessonId:  "Dars",
};

/**
 * Exam form validatsiya qoidalari
 */
export const ExamValidationSchema = {
  title:     simpleName(ExamFieldNames.title, { min: 1, max: 100 }),
  startTime: [{ required: true, message: `${ExamFieldNames.startTime} tanlanishi shart`, trigger: 'change' }],
  endTime:   [{ required: true, message: `${ExamFieldNames.endTime} tanlanishi shart`, trigger: 'change' }],
  lessonId:  [{ required: true, message: `${ExamFieldNames.lessonId} tanlanishi shart`, trigger: 'change' }],
};

/**
 * Bo'sh form state
 */
export const ExamInitialState = {
  title:     "",
  startTime: null,
  endTime:   null,
  lessonId:  null,
};

/**
 * Exam ma'lumotlarini form state ga aylantirish
 * @param {Object} exam - Backend dan kelgan exam
 * @returns {Object} Form state
 */
export const mapExamToFormState = (exam) => {
  if (!exam) return { ...ExamInitialState };

  const resolveId = (field) =>
    typeof field === "object" && field !== null
      ? field._id || field.id || null
      : field || null;

  const parseTime = (value) => {
    if (!value) return null;
    if (dayjs.isDayjs(value)) return value;
    return dayjs(value);
  };

  return {
    title:     exam.title || "",
    startTime: parseTime(exam.startTime),
    endTime:   parseTime(exam.endTime),
    lessonId:  resolveId(exam.lessonId),
  };
};

export default {
  fieldNames:     ExamFieldNames,
  schema:         ExamValidationSchema,
  initialState:   ExamInitialState,
  mapToFormState: mapExamToFormState,
};

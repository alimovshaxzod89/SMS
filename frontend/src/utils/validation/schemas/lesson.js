/**
 * Lesson form validatsiya schemasi
 */
import { simpleName } from '../rules';
import dayjs from 'dayjs';

/**
 * Form field nomlari (label uchun)
 */
export const LessonFieldNames = {
  name:      "Dars nomi",
  subjectId: "Fan nomi",
  classId:   "Sinf",
  teacherId: "O'qituvchi",
  day:       "Dars kuni",
  startTime: "Dars boshlanish vaqti",
  endTime:   "Dars tugash vaqti",
};

/**
 * Lesson form validatsiya qoidalari
 */
export const LessonValidationSchema = {
  name:      simpleName(LessonFieldNames.name, { min: 1, max: 100 }),
  subjectId: [{ required: true, message: `${LessonFieldNames.subjectId} tanlanishi shart`, trigger: 'change' }],
  classId:   [{ required: true, message: `${LessonFieldNames.classId} tanlanishi shart`, trigger: 'change' }],
  teacherId: [{ required: true, message: `${LessonFieldNames.teacherId} tanlanishi shart`, trigger: 'change' }],
  day:       [{ required: true, message: `${LessonFieldNames.day} tanlanishi shart`, trigger: 'change' }],
  startTime: [{ required: true, message: `${LessonFieldNames.startTime} tanlanishi shart`, trigger: 'change' }],
  endTime:   [{ required: true, message: `${LessonFieldNames.endTime} tanlanishi shart`, trigger: 'change' }],
};

/**
 * Bo'sh form state
 */
export const LessonInitialState = {
  name:      "",
  subjectId: null,
  classId:   null,
  teacherId: null,
  day:       null,
  startTime: null,
  endTime:   null,
};

/**
 * Lesson ma'lumotlarini form state ga aylantirish
 * @param {Object} lesson - Backend dan kelgan lesson
 * @returns {Object} Form state
 */
export const mapLessonToFormState = (lesson) => {
  if (!lesson) return { ...LessonInitialState };

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
    name:      lesson.name || "",
    subjectId: resolveId(lesson.subjectId),
    classId:   resolveId(lesson.classId),
    teacherId: resolveId(lesson.teacherId),
    day:       lesson.day || null,
    startTime: parseTime(lesson.startTime),
    endTime:   parseTime(lesson.endTime),
  };
};

export default {
  fieldNames:     LessonFieldNames,
  schema:         LessonValidationSchema,
  initialState:   LessonInitialState,
  mapToFormState: mapLessonToFormState,
};

/**
 * Assignment form validatsiya schemasi
 */
import { simpleName } from '../rules';
import dayjs from 'dayjs';

/**
 * Form field nomlari (label uchun)
 */
export const AssignmentFieldNames = {
  title:     "Topshiriq nomi",
  startDate: "Boshlanish sanasi",
  dueDate:   "Tugash sanasi",
  lessonId:  "Dars",
};

/**
 * Assignment form validatsiya qoidalari
 */
export const AssignmentValidationSchema = {
  title:     simpleName(AssignmentFieldNames.title, { min: 5, max: 200 }),
  startDate: [{ required: true, message: `${AssignmentFieldNames.startDate} tanlanishi shart`, trigger: 'change' }],
  dueDate:   [{ required: true, message: `${AssignmentFieldNames.dueDate} tanlanishi shart`, trigger: 'change' }],
  lessonId:  [{ required: true, message: `${AssignmentFieldNames.lessonId} tanlanishi shart`, trigger: 'change' }],
};

/**
 * Bo'sh form state
 */
export const AssignmentInitialState = {
  title:     "",
  startDate: null,
  dueDate:   null,
  lessonId:  null,
};

/**
 * Assignment ma'lumotlarini form state ga aylantirish
 * @param {Object} assignment - Backend dan kelgan assignment
 * @returns {Object} Form state
 */
export const mapAssignmentToFormState = (assignment) => {
  if (!assignment) return { ...AssignmentInitialState };

  const resolveId = (field) =>
    typeof field === "object" && field !== null
      ? field._id || field.id || null
      : field || null;

  const parseDate = (value) => {
    if (!value) return null;
    if (dayjs.isDayjs(value)) return value;
    return dayjs(value);
  };

  return {
    title:     assignment.title || "",
    startDate: parseDate(assignment.startDate),
    dueDate:   parseDate(assignment.dueDate),
    lessonId:  resolveId(assignment.lessonId),
  };
};

export default {
  fieldNames:     AssignmentFieldNames,
  schema:         AssignmentValidationSchema,
  initialState:   AssignmentInitialState,
  mapToFormState: mapAssignmentToFormState,
};

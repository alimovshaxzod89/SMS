/**
 * Event form validatsiya schemasi
 */
import { stringLength } from '../rules';
import dayjs from 'dayjs';

/**
 * Form field nomlari (label uchun)
 */
export const EventFieldNames = {
  title:       "Tadbir nomi",
  description: "Tavsif",
  startTime:   "Boshlanish vaqti",
  endTime:     "Tugash vaqti",
  classId:     "Sinf",
};

/**
 * Event form validatsiya qoidalari
 */
export const EventValidationSchema = {
  title:       stringLength(EventFieldNames.title, { min: 1, max: 200, isRequired: true }),
  description: stringLength(EventFieldNames.description, { min: 1, max: 5000, isRequired: true }),
  startTime:   [{ required: true, message: `${EventFieldNames.startTime} tanlanishi shart`, trigger: 'change' }],
  endTime:     [{ required: true, message: `${EventFieldNames.endTime} tanlanishi shart`, trigger: 'change' }],
};

/**
 * Bo'sh form state
 */
export const EventInitialState = {
  title:       "",
  description: "",
  startTime:   null,
  endTime:     null,
  classId:     null,
};

/**
 * Event ma'lumotlarini form state ga aylantirish
 * @param {Object} event - Backend dan kelgan event
 * @returns {Object} Form state
 */
export const mapEventToFormState = (event) => {
  if (!event) return { ...EventInitialState };

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
    title:       event.title || "",
    description: event.description || "",
    startTime:   parseTime(event.startTime),
    endTime:     parseTime(event.endTime),
    classId:     resolveId(event.classId),
  };
};

export default {
  fieldNames:     EventFieldNames,
  schema:         EventValidationSchema,
  initialState:   EventInitialState,
  mapToFormState: mapEventToFormState,
};

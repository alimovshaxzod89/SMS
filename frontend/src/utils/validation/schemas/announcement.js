/**
 * Announcement form validatsiya schemasi
 */
import { simpleName, stringLength, required } from '../rules';
import dayjs from 'dayjs';

/**
 * Form field nomlari (label uchun)
 */
export const AnnouncementFieldNames = {
  title:       "Sarlavha",
  description: "Tavsif",
  date:        "Sana",
  classId:     "Sinf",
};

/**
 * Announcement form validatsiya qoidalari
 */
export const AnnouncementValidationSchema = {
  title:       simpleName(AnnouncementFieldNames.title, { min: 2, max: 200 }),
  description: stringLength(AnnouncementFieldNames.description, { min: 5, max: 1000 }),
  date:        [{ required: true, message: `${AnnouncementFieldNames.date} tanlanishi shart`, trigger: 'change' }],
  classId:     [],
};

/**
 * Bo'sh form state
 */
export const AnnouncementInitialState = {
  title:       "",
  description: "",
  date:        null,
  classId:     null,
};

/**
 * Announcement ma'lumotlarini form state ga aylantirish
 * @param {Object} announcement - Backend dan kelgan announcement
 * @returns {Object} Form state
 */
export const mapAnnouncementToFormState = (announcement) => {
  if (!announcement) return { ...AnnouncementInitialState };

  const resolveId = (field) =>
    typeof field === "object" && field !== null
      ? field._id || field.id || null
      : field || null;

  return {
    title:       announcement.title || "",
    description: announcement.description || "",
    date:        announcement.date ? dayjs(announcement.date) : null,
    classId:     resolveId(announcement.classId) || null,
  };
};

export default {
  fieldNames:     AnnouncementFieldNames,
  schema:         AnnouncementValidationSchema,
  initialState:   AnnouncementInitialState,
  mapToFormState: mapAnnouncementToFormState,
};

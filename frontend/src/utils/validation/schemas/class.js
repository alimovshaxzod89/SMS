/**
 * Class form validatsiya schemasi
 */
import { simpleName, number } from '../rules';

/**
 * Form field nomlari (label uchun)
 */
export const ClassFieldNames = {
  name:         "Sinf nomi",
  capacity:     "Sig'im",
  gradeId:      "Daraja",
  supervisorId: "Supervisor (O'qituvchi)",
  students:     "O'quvchilar",
};

/**
 * Class form validatsiya qoidalari
 */
export const ClassValidationSchema = {
  name:         simpleName(ClassFieldNames.name, { min: 1, max: 50 }),
  capacity:     number(ClassFieldNames.capacity, { min: 1, max: 200 }),
  gradeId:      [{ required: true, message: "Daraja tanlanishi shart", trigger: 'change' }],
  supervisorId: [],
  students:     [],
};

/**
 * Bo'sh form state
 */
export const ClassInitialState = {
  name:         "",
  capacity:     null,
  gradeId:      null,
  supervisorId: null,
  students:     [],
};

/**
 * Class ma'lumotlarini form state ga aylantirish
 * @param {Object} classData - Backend dan kelgan class
 * @returns {Object} Form state
 */
export const mapClassToFormState = (classData) => {
  if (!classData) return { ...ClassInitialState };

  const resolveId = (field) =>
    typeof field === "object" && field !== null
      ? field._id || field.id || null
      : field || null;

  return {
    name:         classData.name || "",
    capacity:     classData.capacity || null,
    gradeId:      resolveId(classData.gradeId),
    supervisorId: resolveId(classData.supervisorId),
    students:     classData.students?.map(resolveId).filter(Boolean) || [],
  };
};

export default {
  fieldNames:     ClassFieldNames,
  schema:         ClassValidationSchema,
  initialState:   ClassInitialState,
  mapToFormState: mapClassToFormState,
};
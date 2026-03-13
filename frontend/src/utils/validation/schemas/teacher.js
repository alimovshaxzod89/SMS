/**
 * Teacher form validatsiya schemasi
 */
import { required, email, phone } from '../rules';

/**
 * Form field nomlari
 */
export const TeacherFieldNames = {
  name: 'F.I.O',
  email: 'Email',
  phone: 'Telefon',
  address: 'Manzil',
};

/**
 * Teacher form validatsiya qoidalari
 */
export const TeacherValidationSchema = {
  name: [required(TeacherFieldNames.name)],
  email: email(TeacherFieldNames.email),
  phone: phone(TeacherFieldNames.phone),
  address: [required(TeacherFieldNames.address)],
};

/**
 * Bo'sh form state
 */
export const TeacherInitialState = {
  name: '',
  email: '',
  phone: '',
  address: '',
};

/**
 * Teacher ma'lumotlarini form state ga aylantirish
 */
export const mapTeacherToFormState = (teacher) => {
  if (!teacher) return { ...TeacherInitialState };

  return {
    name: teacher.name || '',
    email: teacher.email || '',
    phone: teacher.phone || '',
    address: teacher.address || '',
  };
};

export default {
  fieldNames: TeacherFieldNames,
  schema: TeacherValidationSchema,
  initialState: TeacherInitialState,
  mapToFormState: mapTeacherToFormState,
};

/**
 * Student form validatsiya schemasi
 */
import { required, email, phone } from '../rules';

/**
 * Form field nomlari
 */
export const StudentFieldNames = {
  username:  "Username",
  password:  "Parol",
  name:      "Ism",
  surname:   "Familya",
  address:   "Manzil",
  birthday:  "Tug'ilgan kun",
  sex:       "Jins",
  bloodType: "Qon guruhi",
  email:     "Email",
  phone:     "Telefon raqam",
  img:       "Rasm",
  classId:   "Sinf",
  gradeId:   "Daraja",
  parentId:  "Ota-ona",
};

/**
 * Student form validatsiya qoidalari
*/
export const StudentValidationSchema = {
  name:     [required(StudentFieldNames.name)],
  surname:  [required(StudentFieldNames.surname)],
  username: [required(StudentFieldNames.username)],
  password: [
    required(StudentFieldNames.password),
    { min: 8, message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak", trigger: 'blur' },
  ],
  email:    email(StudentFieldNames.email),
  phone:    phone(StudentFieldNames.phone),
  address:  [required(StudentFieldNames.address)],
  birthday: [required(StudentFieldNames.birthday)],
  bloodType: [{ required: true, message: `${StudentFieldNames.bloodType} kiritilishi shart`, trigger: 'change' }],
  sex: [{ required: true, message: `${StudentFieldNames.sex} kiritilishi shart`, trigger: 'change' }],
  img: [],
  classId: [{ required: true, message: `${StudentFieldNames.classId} kiritilishi shart`, trigger: 'change' }],
  gradeId: [],
  parentId: [],
};

/**
 * Bo'sh form state
*/
export const StudentInitialState = {
  username:  "",
  password:  "",
  name:      "",
  surname:   "",
  address:   "",
  birthday:  null,
  sex:       null,
  bloodType: null,
  email:     "",
  phone:     "",
  img:       "",
  classId:   null,
  gradeId:   null,
  parentId:  null,
};

/**
 * Student ma'lumotlarini form state ga aylantirish.
*/
export const mapStudentToFormState = (student) => {
  if (!student) return { ...StudentInitialState };

  const resolveId = (field) =>
    typeof field === 'object' && field !== null
      ? field._id || field.id || null
      : field || null;

  return {
    username:  student.username  || '',
    password:  student.password  || '',
    name:      student.name      || '',
    surname:   student.surname   || '',
    address:   student.address   || '',
    birthday:  student.birthday  || null,
    sex:       student.sex       || null,
    bloodType: student.bloodType || null,
    email:     student.email     || '',
    phone:     student.phone     || '',
    img:       student.img       || '',
    classId:   resolveId(student.classId),
    gradeId:   resolveId(student.gradeId),
    parentId:  resolveId(student.parentId),
  };
};

export default {
  fieldNames:     StudentFieldNames,
  schema:         StudentValidationSchema,
  initialState:   StudentInitialState,
  mapToFormState: mapStudentToFormState,
};

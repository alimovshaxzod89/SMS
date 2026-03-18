/**
 * Student form validatsiya schemasi
 */
import { required, email, phone, stringLength } from "../rules";
import { ValidationMessages } from "../messages";

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
  name:     stringLength(StudentFieldNames.name, { min: 3, max: 50 }),
  surname:  stringLength(StudentFieldNames.surname, { min: 3, max: 50 }),
  username: [
    required(StudentFieldNames.username),
    { min: 5, max: 20, message: ValidationMessages.minLength(StudentFieldNames.username, 5), trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "Username faqat harf, raqam va pastki chiziq (_) bo'lishi mumkin",
      trigger: "blur",
    },
  ],
  password: [
    required(StudentFieldNames.password),
    { min: 8, message: "Parol kamida 8 ta belgi bo'lishi kerak", trigger: "blur" }
  ],
  email:    email(StudentFieldNames.email),
  phone:    phone(StudentFieldNames.phone),
  address:  stringLength(StudentFieldNames.address, { min: 5, max: 200 }),
  birthday: [required(StudentFieldNames.birthday)],
  bloodType: [{ required: true, message: `${StudentFieldNames.bloodType} kiritilishi shart`, trigger: "change" }],
  sex: [{ required: true, message: `${StudentFieldNames.sex} kiritilishi shart`, trigger: "change" }],
  img: [],
  classId: [{ required: true, message: `${StudentFieldNames.classId} kiritilishi shart`, trigger: "change" }],
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
    typeof field === "object" && field !== null
      ? field._id || field.id || null
      : field || null;

  return {
    username:  student.username  || "",
    password:  "",
    name:      student.name      || "",
    surname:   student.surname   || "",
    address:   student.address   || "",
    birthday:  student.birthday  || null,
    sex:       student.sex       || null,
    bloodType: student.bloodType || null,
    email:     student.email     || "",
    phone:     student.phone     || "",
    img:       student.img       || "",
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

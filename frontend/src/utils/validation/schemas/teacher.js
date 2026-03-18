/**
 * Teacher form validatsiya schemasi
 */
import { required, email, phone, stringLength } from "../rules";
import { ValidationMessages } from "../messages";

/**
 * Form field nomlari
 */
export const TeacherFieldNames = {
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
  subjects:  "Fanlar"
};

/**
 * Teacher form validatsiya qoidalari
 */
export const TeacherValidationSchema = {
  name:    stringLength(TeacherFieldNames.name, { min: 3, max: 50 }),
  surname: stringLength(TeacherFieldNames.surname, { min: 3, max: 50 }),
  username: [
    required(TeacherFieldNames.username),
    { min: 5, max: 20, message: ValidationMessages.minLength(TeacherFieldNames.username, 5), trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "Username faqat harf, raqam va pastki chiziq (_) bo'lishi mumkin",
      trigger: "blur",
    },
  ],
  password: [
    required(TeacherFieldNames.password),
    { min: 8, message: "Parol kamida 8 ta belgi bo'lishi kerak", trigger: "blur" }
  ],
  email:    email(TeacherFieldNames.email),
  phone:    phone(TeacherFieldNames.phone),
  address:  stringLength(TeacherFieldNames.address, { min: 5, max: 200 }),
  birthday: [required(TeacherFieldNames.birthday)],
  sex:      [{ required: true, message: `${TeacherFieldNames.sex} kiritilishi shart`, trigger: "change" }],
  bloodType:[{ required: true, message: `${TeacherFieldNames.bloodType} kiritilishi shart`, trigger: "change" }],
  img:      [],
  subjects: [
    { type: "array", max: 10, message: "Eng ko'pi bilan 10 ta fan tanlash mumkin", trigger: "change" }
  ],
};

/**
 * Bo'sh form state
 */
export const TeacherInitialState = {
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
  subjects:  []
};

/**
 * Teacher ma'lumotlarini form state ga aylantirish
 */
export const mapTeacherToFormState = (teacher) => {
  if (!teacher) return { ...TeacherInitialState };

  const resolveId = (field) =>
    typeof field === "object" && field !== null
      ? field._id || field.id || null
      : field || null;

  return {
    username:  teacher.username  || "",
    password:  "",
    name:      teacher.name      || "",
    surname:   teacher.surname   || "",
    address:   teacher.address   || "",
    birthday:  teacher.birthday  || null,
    sex:       teacher.sex       || null,
    bloodType: teacher.bloodType || null,
    email:     teacher.email     || "",
    phone:     teacher.phone     || "",
    img:       teacher.img       || "",
    subjects:  teacher.subjects?.map(resolveId) || []
  };
};

export default {
  fieldNames:     TeacherFieldNames,
  schema:         TeacherValidationSchema,
  initialState:   TeacherInitialState,
  mapToFormState: mapTeacherToFormState,
};

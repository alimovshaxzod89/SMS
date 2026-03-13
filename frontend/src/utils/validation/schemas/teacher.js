/**
 * Teacher form validatsiya schemasi
 */
import { required, email, phone } from '../rules';

/**
 * Form field nomlari
 */
export const TeacherFieldNames = {
  username: "Username",                                                  
  password: "Parol",
  name: "Ism",                                                          
  surname: "Familya",
  address: "Manzil",                                  
  birthday: "Tug'ilgan kun",
  sex: "Jins",
  bloodType: "Qon guruhi (A+)",
  email: "email",
  phone: "Telefon raqam",
  img: "Rasm",
  subjects: "Fanlar"
};

/**
 * Teacher form validatsiya qoidalari
 */
export const TeacherValidationSchema = {
  name: [required(TeacherFieldNames.name)],
  email: email(TeacherFieldNames.email),
  phone: phone(TeacherFieldNames.phone),
  address: [required(TeacherFieldNames.address)],
  username: [required(TeacherFieldNames.username)],                                                  
  password: [required(TeacherFieldNames.password), { min: 8, message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" }],
  surname: [required(TeacherFieldNames.surname)],
  birthday: [required(TeacherFieldNames.birthday)],
  sex: [required(TeacherFieldNames.sex)],
  bloodType: [required(TeacherFieldNames.bloodType)],
  img: [],
  subjects: [{max: 10}]
};

/**
 * Bo'sh form state
 */
export const TeacherInitialState = {
  username: "",                                                  
  password: "",
  name: "",                                                          
  surname: "",
  address: "",                                  
  birthday: null,
  sex: null,
  bloodType: "A+",
  email: "",
  phone: "",
  img: "",
  subjects: []
};

/**
 * Teacher ma'lumotlarini form state ga aylantirish
 */
export const mapTeacherToFormState = (teacher) => {
  if (!teacher) return { ...TeacherInitialState };

  return {
    username: teacher.username || '',                                                  
    password: teacher.password || '',
    name: teacher.name || '',                                                          
    surname: teacher.surname || '',
    address: teacher.address || '',                                  
    birthday: teacher.birthday || null,
    sex: teacher.sex || null,
    bloodType: teacher.bloodType || 'A+',
    email: teacher.email || '',
    phone: teacher.phone || '',
    img: teacher.img || '',
    subjects: (teacher.subjects || []).map(s => s._id || s.id || s)
  };
};

export default {
  fieldNames: TeacherFieldNames,
  schema: TeacherValidationSchema,
  initialState: TeacherInitialState,
  mapToFormState: mapTeacherToFormState,
};

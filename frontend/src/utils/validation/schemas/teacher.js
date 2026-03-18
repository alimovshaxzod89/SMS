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
  bloodType: "Qon guruhi",
  email: "Email",
  phone: "Telefon raqam",
  img: "Rasm",
  subjects: "Fanlar"
};

/**
 * Teacher form validatsiya qoidalari
 */
export const TeacherValidationSchema = {
  name: [required(TeacherFieldNames.name)],
  surname: [required(TeacherFieldNames.surname)],
  username: [required(TeacherFieldNames.username)],                                                  
  password: [
    required(TeacherFieldNames.password), 
    { min: 8, message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak", trigger: 'blur' }
  ],
  email: email(TeacherFieldNames.email),
  phone: phone(TeacherFieldNames.phone),
  address: [required(TeacherFieldNames.address)],
  birthday: [required(TeacherFieldNames.birthday)],
  sex: [{ required: true, message: `${TeacherFieldNames.sex} kiritilishi shart`, trigger: 'change' }],
  bloodType: [{ required: true, message: `${TeacherFieldNames.bloodType} kiritilishi shart`, trigger: 'change' }],
  img: [],
  subjects: [{ type: 'array', max: 10, message: "Eng ko'pi bilan 10 ta fan tanlash mumkin", trigger: 'change' }],
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
  bloodType: null,
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
    bloodType: teacher.bloodType || null,
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

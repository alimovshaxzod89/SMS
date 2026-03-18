/**
 * Parent form validatsiya schemasi
 */
import { required, phone, stringLength } from '../rules';
import { ValidationMessages } from '../messages';

/**
 * Form field nomlari
 */
export const ParentFieldNames = {
  username: "Username",
  password: "Parol",
  name:     "Ism",
  surname:  "Familya",
  email:    "Email",
  phone:    "Telefon raqam",
  address:  "Manzil",
};

/**
 * Parent form validatsiya qoidalari
 */
export const ParentValidationSchema = {
  name:     stringLength(ParentFieldNames.name, { min: 3, max: 50 }),
  surname:  stringLength(ParentFieldNames.surname, { min: 3, max: 50 }),
  username: [
    required(ParentFieldNames.username),
    { min: 5, max: 20, message: ValidationMessages.minLength(ParentFieldNames.username, 5), trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "Username faqat harf, raqam va pastki chiziq (_) bo'lishi mumkin",
      trigger: "blur",
    },
  ],
  password: [
    required(ParentFieldNames.password),
    { min: 8, message: "Parol kamida 8 ta belgi bo'lishi kerak", trigger: "blur" }
  ],
  phone:   phone(ParentFieldNames.phone),
  address: stringLength(ParentFieldNames.address, { min: 5, max: 200 }),
  // Email ixtiyoriy — faqat format tekshiriladi
  email: [
    {
      type: "email",
      message: ValidationMessages.email(),
      trigger: "blur",
    },
  ],
};

/**
 * Bo'sh form state
 */
export const ParentInitialState = {
  username: "",
  password: "",
  name:     "",
  surname:  "",
  email:    "",
  phone:    "",
  address:  "",
};

/**
 * Parent ma'lumotlarini form state ga aylantirish
 */
export const mapParentToFormState = (parent) => {
  if (!parent) return { ...ParentInitialState };

  return {
    username: parent.username || "",
    password: "",
    name:     parent.name     || "",
    surname:  parent.surname  || "",
    email:    parent.email    || "",
    phone:    parent.phone    || "",
    address:  parent.address  || "",
  };
};

export default {
  fieldNames:     ParentFieldNames,
  schema:         ParentValidationSchema,
  initialState:   ParentInitialState,
  mapToFormState: mapParentToFormState,
};

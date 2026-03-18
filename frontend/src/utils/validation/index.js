/**
 * Validatsiya tizimi - Markazlashtirilgan eksport
 */

// Xabarlar
export { ValidationMessages } from './messages';

// Qoidalar
export {
  required,
  simpleName,
  email,
  phone,
  stringLength,
  arrayRequired,
  number,
  pattern,
  asyncValidator,
} from './rules';

// Schemalar
export { default as SubjectSchema } from './schemas/subject';
export { default as TeacherSchema } from './schemas/teacher';
export { default as StudentSchema } from './schemas/student';
export { default as ParentSchema } from './schemas/parent';

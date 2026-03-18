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
export { default as ClassSchema } from './schemas/class';
export { default as LessonSchema } from './schemas/lesson';
export { default as ExamSchema } from './schemas/exam';
export { default as AssignmentSchema } from './schemas/assignment';
export { default as AnnouncementSchema } from './schemas/announcement';
export { default as EventSchema } from './schemas/event';
export { default as ResultSchema } from './schemas/result';

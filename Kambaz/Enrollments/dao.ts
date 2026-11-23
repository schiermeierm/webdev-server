import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  function findEnrollmentsForUser(userId) {
    return db.enrollments.filter((enrollment) => enrollment.user === userId);
  }
  function findUsersForCourse(courseId) {
    return db.users.filter((user) =>
      db.enrollments.some(
        (enrollment) => enrollment.user === user._id && enrollment.course === courseId,
      ),
    );
  }
  function enrollUserInCourse(userId, courseId) {
    const exists = db.enrollments.some(
      (enrollment) => enrollment.user === userId && enrollment.course === courseId,
    );
    if (exists) return;
    db.enrollments = [...db.enrollments, { _id: uuidv4(), user: userId, course: courseId }];
  }
  function unenrollUserFromCourse(userId, courseId) {
    db.enrollments = db.enrollments.filter(
      (enrollment) => !(enrollment.user === userId && enrollment.course === courseId),
    );
  }
  return { findEnrollmentsForUser, findUsersForCourse, enrollUserInCourse, unenrollUserFromCourse };
}

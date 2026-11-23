import CoursesDao from "./dao";
import EnrollmentsDao from "../Enrollments/dao";
import { resolveUserId } from "../Enrollments/routes";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  const findAllCourses = (req, res) => {
    res.json(dao.findAllCourses());
  };
  const findCoursesForEnrolledUser = (req, res) => {
    const userId = resolveUserId(req, res);
    if (!userId) return;
    res.json(dao.findCoursesForEnrolledUser(userId));
  };
  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = dao.createCourse(req.body);
    if (currentUser) {
      enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    }
    res.json(newCourse);
  };
  const deleteCourse = (req, res) => {
    const { courseId } = req.params;
    dao.deleteCourse(courseId);
    res.sendStatus(200);
  };
  const updateCourse = (req, res) => {
    const { courseId } = req.params;
    const course = dao.updateCourse(courseId, req.body);
    if (!course) {
      res.status(404).json({ message: `Unable to update course ${courseId}` });
      return;
    }
    res.json(course);
  };

  app.get("/api/courses", findAllCourses);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.post("/api/users/current/courses", createCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.put("/api/courses/:courseId", updateCourse);
}

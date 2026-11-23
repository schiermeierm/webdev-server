import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import Hello from "./Hello";
import Lab5 from "./Lab5/index";
import db from "./Kambaz/Database";
import UserRoutes from "./Kambaz/Users/routes";
import CourseRoutes from "./Kambaz/Courses/routes";
import ModuleRoutes from "./Kambaz/Modules/routes";
import AssignmentRoutes from "./Kambaz/Assignments/routes";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes";

const app = express();

// CLIENT_URL may list several origins separated by commas,
// e.g. the Vercel a5 preview URL and http://localhost:3000.
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      // Requests without an Origin header (browser address bar, curl) are allowed.
      callback(null, !origin || allowedOrigins.includes(origin));
    },
  }),
);

const sessionOptions: session.SessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}
app.use(session(sessionOptions));
app.use(express.json());

Lab5(app);
UserRoutes(app, db);
CourseRoutes(app, db);
ModuleRoutes(app, db);
AssignmentRoutes(app, db);
EnrollmentRoutes(app, db);
Hello(app);

app.listen(process.env.PORT || 4000);

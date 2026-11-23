import ModulesDao from "./dao";

export default function ModuleRoutes(app, db) {
  const dao = ModulesDao(db);

  const findModulesForCourse = (req, res) => {
    const { courseId } = req.params;
    res.json(dao.findModulesForCourse(courseId));
  };
  const createModuleForCourse = (req, res) => {
    const { courseId } = req.params;
    const module = { ...req.body, course: courseId };
    res.json(dao.createModule(module));
  };
  const deleteModule = (req, res) => {
    const { moduleId } = req.params;
    dao.deleteModule(moduleId);
    res.sendStatus(200);
  };
  const updateModule = (req, res) => {
    const { moduleId } = req.params;
    const module = dao.updateModule(moduleId, req.body);
    if (!module) {
      res.status(404).json({ message: `Unable to update module ${moduleId}` });
      return;
    }
    res.json(module);
  };

  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.delete("/api/modules/:moduleId", deleteModule);
  app.put("/api/modules/:moduleId", updateModule);
}

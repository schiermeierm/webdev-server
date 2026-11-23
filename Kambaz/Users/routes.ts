import UsersDao from "./dao";

export default function UserRoutes(app, db) {
  const dao = UsersDao(db);

  const signin = (req, res) => {
    const { username, password } = req.body;
    const currentUser = dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };
  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };
  const signout = (req, res) => {
    req.session.destroy(() => {
      res.sendStatus(200);
    });
  };
  const updateUser = (req, res) => {
    const userId = req.params.userId;
    dao.updateUser(userId, req.body);
    const updatedUser = dao.findUserById(userId);
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = updatedUser;
    }
    res.json(updatedUser);
  };
  // People table (optional, §5.4.9): faculty create users
  const createUser = (req, res) => {
    res.json(dao.createUser(req.body));
  };
  const deleteUser = (req, res) => {
    dao.deleteUser(req.params.userId);
    res.sendStatus(200);
  };

  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.get("/api/users/profile", profile);
  app.post("/api/users", createUser);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
}

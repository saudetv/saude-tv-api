const express = require("express");
const routes = express.Router();

const UserController = require("../controllers/UserController");
const ModuleController = require("../controllers/ModuleController");
const ProfileController = require("../controllers/ProfileController");

routes.get("/", (req, res) => {
  return res.json("Version 1 of BORA! API is on");
});

routes.get("/users", UserController.index);
routes.get("/users/:id", UserController.show);
routes.post("/users", UserController.store);
routes.get("/check", UserController.checkAuth);
routes.put("/users/:id", UserController.update);
routes.delete("/users/:id", UserController.destroy);
routes.patch("/users/:id", UserController.update);

routes.get("/modules", ModuleController.index);
routes.get("/modules/:id", ModuleController.show);
routes.post("/modules", ModuleController.store);
routes.put("/modules/:id", ModuleController.update);
routes.delete("/modules/:id", ModuleController.destroy);
routes.patch("/modules/:id", ModuleController.update);

routes.get("/profiles", ProfileController.index);
routes.get("/profiles/:id", ProfileController.show);
routes.post("/profiles", ProfileController.store);
routes.put("/profiles/:id", ProfileController.update);
routes.delete("/profiles/:id", ProfileController.destroy);
routes.patch("/profiles/:id", ProfileController.update);

module.exports = routes;

const express = require("express");
const authenticateToken = require("../middleware");
const {
  add,
  getProjects,
  update,
  deleteProject,
} = require("../controllers/ProjectController");
const router = express.Router();

router.post("/add", authenticateToken, add);
router.put("/update/:id", authenticateToken, update);
router.delete("/delete/:id", authenticateToken, deleteProject);
router.get("/", authenticateToken, getProjects);

module.exports = router;

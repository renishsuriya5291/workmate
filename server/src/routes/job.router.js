const express = require("express");
const router = express.Router();
const {
  add,
  allJobs,
  editJob,
  deleteJob,
  getAllJob,
  addliked,
  cancel,
} = require("../controllers/JobController");
const authenticateToken = require("../middleware");
router.post("/add", authenticateToken, add);
router.get("/", authenticateToken, allJobs);
router.put("/update/:jobId", authenticateToken, editJob);
router.delete("/delete/:jobId", authenticateToken, deleteJob);
router.get("/all", authenticateToken, getAllJob);
router.put("/like/:jobId", authenticateToken, addliked);
router.put("/cancel/:jobId", authenticateToken, cancel);
module.exports = router;

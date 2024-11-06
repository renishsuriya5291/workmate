const express = require("express");
const router = express.Router();
const {
  addContract,
  getAllContracts,
  createMilestone,
  editmilestone,
  submitWork,
  revisionWork,
  accpectWork,
} = require("../controllers/COntract.controller");
const authenticateToken = require("../middleware");

router.post("/addContract/:jobId/:proposalId", authenticateToken, addContract);
router.get("/getallcontracts", authenticateToken, getAllContracts);
router.post("/addmilestone/:contractId", authenticateToken, createMilestone);
router.put(
  "/updatemilestone/:contractId/:milestoneId",
  authenticateToken,
  editmilestone
);
router.post("/submit/:contractId/:milestoneId", authenticateToken, submitWork);
router.post(
  "/submit/feedack/:contractId/:milestoneId",
  authenticateToken,
  revisionWork
);
router.post(
  "/accpect/:contractId/:milestoneId",
  authenticateToken,
  accpectWork
);
module.exports = router;

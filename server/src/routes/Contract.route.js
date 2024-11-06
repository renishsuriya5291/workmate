const express = require("express");
const router = express.Router();
const {
  addContract,
  getAllContracts,
  createMilestone,
  editmilestone,
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
module.exports = router;

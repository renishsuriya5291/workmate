const express = require("express");
const router = express.Router();
const {
  addContract,
  getAllContracts,
  createMilestone,
} = require("../controllers/COntract.controller");
const authenticateToken = require("../middleware");

router.post("/addContract/:jobId/:proposalId", authenticateToken, addContract);
router.get("/getallcontracts", authenticateToken, getAllContracts);
router.post("/addmilestone/:contractId", authenticateToken, createMilestone);
module.exports = router;

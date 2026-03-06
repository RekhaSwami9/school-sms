const express = require("express");
const router = express.Router();
const feeController = require("../controllers/feeController");

router.get("/", feeController.getAllFees);
router.get("/stats", feeController.getFeeStats);
router.get("/:id", feeController.getFeeById);
router.post("/", feeController.createFee);
router.put("/:id", feeController.updateFee);
router.delete("/:id", feeController.deleteFee);
router.post("/:id/reminder", feeController.sendReminder);

module.exports = router;

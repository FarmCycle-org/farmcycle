const express = require("express");
const router = express.Router();
const claimController = require("../controllers/claimController");
const { protect } = require("../middleware/authMiddleware");

// Create claim (collector only)
router.post("/:id/claim", protect, claimController.createClaim);

//ORDER MATTERS
// Get my claims (collector)
router.get("/my/claims", protect, claimController.getMyClaims);

//  claims seen by provider on their listing
router.get("/:id/claims", protect, claimController.getClaimsForWaste);

router.put("/:id/approve", protect, claimController.approveClaim);

router.put("/:id/reject", protect, claimController.rejectClaim);

module.exports = router;

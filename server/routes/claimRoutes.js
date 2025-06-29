const express = require("express");
const router = express.Router();
const claimController = require("../controllers/claimController");
const { protect } = require("../middleware/authMiddleware");

// Create claim (collector only)
router.post("/:id/claim", protect, claimController.createClaim);

//ORDER MATTERS
// Get my claims (collector)
router.get("/my/claims", protect, claimController.getMyClaims);

// Get all claims across my waste listings (Provider)
router.get("/my/listing-claims", protect, claimController.getClaimsOnMyListings);

// Get all claims for all listings created by provider
router.get("/provider/claims", protect, claimController.getClaimsForMyListings);

//  claims seen by provider on their listing
router.get("/:id/claims", protect, claimController.getClaimsForWaste);

// approve/reject claim
router.put("/:id/approve", protect, claimController.approveClaim);
router.put("/:id/reject", protect, claimController.rejectClaim);

//collector confirms collection
router.put("/:id/collected", protect, claimController.confirmCollected);

// Cancel a claim (collector can delete their own pending claim)
router.delete("/:id/cancel", protect, claimController.cancelClaim);

module.exports = router;
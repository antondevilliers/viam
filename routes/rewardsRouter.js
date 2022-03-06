const express = require("express");
const rewardsController = require("../controllers/rewardsController");
const validateController = require("../controllers/validateController");

const router = express.Router();

// Get a users profile.
router.route("/msisdn/:msisdn")
  .get(
    validateController.validateData,
    rewardsController.getRewards
    );
   
// This route will perform a test to see if the msisdn parameter exist.  
router.route("/msisdn")
  .get(
    validateController.responseNoField,
    );

module.exports = router;
const express = require("express");
const balanceController = require("../controllers/balanceController");
const validateController = require("../controllers/validateController");

const router = express.Router();

// Perform a balance check on a supplied msisdn id.
router.route("/msisdn/:msisdn")
  .get(
    validateController.validateData,
    balanceController.getCustomerBalance
    );

// This route will perform a test to see if the msisdn parameter exist.  
router.route("/msisdn")
  .get(
    validateController.responseNoField,
    );

module.exports = router;

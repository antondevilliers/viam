const express = require("express");
const gameController = require("../controllers/gameController");
const validateController = require("../controllers/validateController");

const router = express.Router();

// Get a users profile.
router.route("/msisdn/:msisdn")
  .get(
    validateController.validateData,
    gameController.playTheGame
    );
   
// This route will perform a test to see if the msisdn parameter exist.  
router.route("/msisdn")
  .get(
    validateController.responseNoField,
    );

module.exports = router;
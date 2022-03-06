const express = require("express");
const profileController = require("../controllers/profileController");
const validateController = require("../controllers/validateController");

const router = express.Router();

// Get a users profile.
router.route("/wallet/msisdn/:msisdn")
  .get(
    validateController.validateData,
    profileController.getWallets
    );


// Get a user profile (wallet + reward)
/* 
  This route is experimental since it needs to combine a route from a problematic API + a very unstable /wallet/ route on the ACME API server.

  Problem with the wallet API route is that 99.9% of the time it only returns errors.
  Over a period of a hour, continues loop, only 1x valid api call was returned.
  Out of all the errors, the one in question was "Cannot read property 'map' of undefined" error that could not loop over the wallet list result.
  Which indicated that on the ACME XML server, there is no array value to loop over and no error protection in place.
*/
router.route("/walletref/msisdn/:msisdn")
  .get(
    validateController.validateData,
    profileController.getWalletsWithRef
  );
   
// This route will perform a test to see if the msisdn parameter exist.  
router.route("/wallet/msisdn")
  .get(
    validateController.responseNoField,
    );

module.exports = router;
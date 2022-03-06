/**
 *  Validation Controller
 *  This middleware controller performs valdiation and adjustments.
 *  @version 1.0.0
 *
 */
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

/**
 * msisdn field validation
 * Middleware function.
 * To validate the msisdn field and perform conversion if requried.
 * 
 * @version 1.0.0
 * 
 */
 exports.validateData = catchAsync(async (req, res, next) => {
  let coverted_msisdn;
  let { msisdn } = req.params;

  if (msisdn.toString().length < 10 || msisdn.toString().length > 11) {
    res.status(400).json({
      response: {
        status: 400,
        message:
          `field lenght must be between 10 or 11 digits long. Example msisdn's: 
          27826305555(international dailing code prefix) or 0826305555(local number)`,
      },
    });
    return false;
  }

  /**
     * We need to change the prefix of the msisdn number, because the API does not accept international prefixes.
     * Reason: To place it here? Is because we need to convert it before its delivered to the api call, because 
     * we want the API to return and error on the msisdn, if digits are missing. This is only a temp solutiom,
     * as it will involved a more complex analysis and adjustment to check for valid phone numbers.
     * 
     * Suggestion: Maybe move this under a new middleware that performs "changes/adjustments".
     * Maybe not required as we test for the field and update the field in the same place.
     * 
  */
  if (msisdn.startsWith(`27`)) {
    // we can use replace here, as replace only replace the first instance.
    coverted_msisdn = msisdn.replace("27", "0");
    // replace the previous value in the request object.
    req.params.msisdn = coverted_msisdn;
  }

  next();
});


/**
 * Reponse for empty field.
 * Middleware function.
 * @version 1.0.0
 * Description: Response on empty field.
 */
 exports.responseNoField = catchAsync(async (req, res, next) => {
  res.status(422).json({
    response: {
      status: 422,
      message: "msisdn field is required",
    },
  });
});
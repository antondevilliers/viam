/**
 *  Balance Controller
 *  This controller interact with the customer balances.
 *  @version 1.0.0
 *
 */
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { fetchXMLData } = require("../controllers/apiFactory");

/**
 * Route: api/v1/balance/msisdn/:msisdn
 * Method: Get
 * @version 1.0.0
 */
exports.getCustomerBalance = catchAsync(async (req, res, next) => {
  const { msisdn } = req.params;
  const data = await fetchXMLData('balance', msisdn);

  // Lets create custom Reponse Object, based on status code.  
  let ObjResponseConstructor = new Object();
  
  // !200 reponse object
  if (data.statusCode !== 200) {
    ObjResponseConstructor = {
      response: {
        status: data.statusCode,
        message: data.data.message,
      },
    };
  }

  // 200: reponse object
  if (data.statusCode === 200) {
    ObjResponseConstructor = {
      msisdn,
      balance:
        data && data.data && data.data.BalanceRespone
          ? Number(
              data.data.BalanceRespone.Balance.LineItems.LineItem.BalanceElement
                .BalanceSpecifications.Specification.balance._text
            )
          : 0,
      response: {
        status: 200,
        message: `Balance for user ${msisdn}`,
      },
    };
  }

  // Response
  res.status(200).json(ObjResponseConstructor);
});

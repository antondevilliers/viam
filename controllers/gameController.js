/**
 *  Balance Controller
 *  This controller interact with the customer balances.
 *  @version 1.0.0
 *
 */
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { createXMLGame } = require("./xmlFactory");
const { fetchXMLData } = require("../controllers/apiFactory");

/**
 * Route: api/v1/balance/msisdn/:msisdn
 * Method: Get
 * @version 1.0.0
 */
exports.playTheGame = catchAsync(async (req, res, next) => {
  const { msisdn } = req.params;
  // Play the game
  const data = await fetchXMLData("play", msisdn);
  let balanceData;
  let balanceResults;
  if (data) {
    // Get the customer Balance
    balanceData = await fetchXMLData("balance", msisdn);
    balanceResults =
      balanceData && balanceData.data && balanceData.data.BalanceRespone
        ? Number(
            balanceData.data.BalanceRespone.Balance.LineItems.LineItem
              .BalanceElement.BalanceSpecifications.Specification.balance._text
          )
        : 0;
  }

  const condensedData = (data && data.data && data.data.PlayRespone) ? 
    data.data.PlayRespone.Play.LineItems.LineItem.PlayElement.Specifications
      .Specification : '';

  // get the won results
  const result = (condensedData && condensedData.result && condensedData.result._text) ? condensedData.result._text : '';
  let resultMessage = (condensedData && condensedData.rewardRef && condensedData.rewardRef._text) ? condensedData.rewardRef._text : '';

  resultMessage =  `You have won a ` + resultMessage.replace(/-/g," ");

  let wonResult;
  let descriptionResult;
  switch (result) {
    case "42":
      wonResult = true;
      descriptionResult = resultMessage;
      break;

    case "99":
      wonResult = false;
      descriptionResult = "Sorry better luck next time";
      break;

    default:
      break;
  }

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
      balance: balanceResults,
      won: wonResult,
      description: descriptionResult,
      response: {
        status: 200,
        message: `Profile for user ${msisdn}`,
      },
    };
  }

  // Response
  res.status(200).json(ObjResponseConstructor);
});

/**
 *  Profile Controller
 *  This controller interact with the customer profile.
 *  @version 1.0.0
 *
 */
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { createXMLRewards } = require("./xmlFactory");
const { fetchXMLData } = require("../controllers/apiFactory");


/**
 * Route: api/v1/rewards/msisdn/:msisdn
 * Method: Get
 * @version 1.0.0
 */
exports.getRewards = catchAsync(async (req, res, next) => {
  const { msisdn } = req.params;
  const data = await fetchXMLData('rewards', msisdn);

  // reconstruct of the rewards for the reponse
  const rewardsData = (data && data.data && data.data.RewardRespone) ? data.data.RewardRespone.Reward.LineItems.LineItem.RewardElement
  .RewardSpecifications.Items.reward.map( reward => {
    return {
      ref: reward.reference._text,
      description: reward.description._text
    }
  }) : '';

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
      rewards: rewardsData,
      response: {
        status: 200,
        message: `Rewards for user ${msisdn}`,
      },
    };
  }

  // Response
  res.status(200).json(ObjResponseConstructor);
});

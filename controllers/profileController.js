/**
 *  Profile Controller
 *  This controller interact with the customer profile.
 *  @version 1.0.0
 *
 */
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { createXMLWallet } = require("./xmlFactory");
const { fetchXMLData } = require("../controllers/apiFactory");

/**
 * Route: api/v1/profiles/wallet/msisdn//:msisdn
 * Method: Get
 * @version 1.0.0
 */
exports.getWallets = catchAsync(async (req, res, next) => {
  const { msisdn } = req.params;
  const data = await fetchXMLData("wallet", msisdn);

  // reconstruct of the wallet for the reponse && counter for when not an array is returned. - not mentioned in document example.
  // For my own sanity, I did not condense the following code, because I need to full object map for any debugging. Any other time, I would condensie it.
  const walletData =
    data && data.data && data.data.WalletRespone && data.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement.WalletSpecifications.Items.reward && Array.isArray(data.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement.WalletSpecifications.Items.reward)
      ? data.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement.WalletSpecifications.Items.reward.map(
          (reward) => {
            return {
              description: reward.description._text,
              awardedAt: reward.timestamp._text,
            };
          }
        )
      : (data.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement.WalletSpecifications.Items.reward) ? 
      [{  
        description: data.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement.WalletSpecifications.Items.reward.description._text,
        timestamp :  data.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement.WalletSpecifications.Items.reward.timestamp._text
      }] : [] ;

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
      wallet: walletData,
      response: {
        status: 200,
        message: `Balance for user ${msisdn}`,
      },
    };
  }

  // Response
  res.status(200).json(ObjResponseConstructor);
});


/**
 * Route: api/v1/profiles/walletref/msisdn//:msisdn
 * Method: Get
 * @version 1.0.0
 */
 exports.getWalletsWithRef = catchAsync(async (req, res, next) => {
  const { msisdn } = req.params;
  const data = await fetchXMLData("wallet", msisdn);

  let rewardsResults;
  if (data) {
    // Get the customer Balance
    rewardsResults = await fetchXMLData("rewards", msisdn);
    rewardsResults = (rewardsResults && rewardsResults.data && rewardsResults.data.RewardRespone) ? rewardsResults.data.RewardRespone.Reward.LineItems.LineItem.RewardElement
    .RewardSpecifications.Items.reward.map( reward => {
      return {
        ref: reward.reference._text,
        description: reward.description._text
      }
    }) : '';
  }

  // reconstruct of the wallet for the reponse && counter for when not an array is returned. - not mentioned in document example.
  const walletData =
    data && data.data && data.data.WalletRespone && data.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement.WalletSpecifications.Items.reward && Array.isArray(data.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement.WalletSpecifications.Items.reward)
      ? data.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement.WalletSpecifications.Items.reward.map(
          (reward) => {
            return {
              description: reward.description._text,
              awardedAt: reward.timestamp._text,
            };
          }
        )
      : (data.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement.WalletSpecifications.Items.reward) ? 
      [{  
        description: data.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement.WalletSpecifications.Items.reward.description._text,
        timestamp :  data.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement.WalletSpecifications.Items.reward.timestamp._text
      }] : [] ;


  /**
   * My compare function prototype
   * REF: https://codesandbox.io/s/elastic-dust-4lpfe4
   */

  let walletArray = [];
  for (let i = 0; i < walletData.length; i++) {
  for (let k = 0; k < rewardsResults.length; k++) {
    if (walletData[i].description === rewardsResults[k].description) {
      walletArray[i] = {
        ref: rewardsResults[k].ref,
        description: walletData[i].description,
        awardedAt: walletData[i].timestamp ? walletData[i].timestamp : walletData[i].awardedAt
      };
    }
  }
}

  // // Lets create custom Reponse Object, based on status code.
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
    wallet: walletArray,
    response: {
      status: 200,
      message: `profile for user ${msisdn}`,
    },
  };
  }

  // // Response
  res.status(200).json(ObjResponseConstructor);
});

//This test is available on codesandbox to run:
//https://codesandbox.io/s/elastic-dust-4lpfe4
import "./styles.css";

document.getElementById("app").innerHTML = `
<h1>Hello Vanilla!</h1>
<div>
  We use the same configuration as Parcel to bundle this sandbox, you can find more
  info about Parcel 
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
</div>
`;

const testRewardsData = {
  statusCode: 200,
  data: {
    RewardRespone: {
      Reward: {
        LineItems: {
          LineItem: {
            RewardElement: {
              CustomerProduct: {
                Ids: {
                  accountId: { _text: "ef055288-e803-4b19-870f-7407a5b69ec7" }
                },
                name: { _text: "Demo Account" }
              },
              RewardSpecifications: {
                Items: {
                  result: { _text: "0" },
                  reward: [
                    {
                      reference: { _text: "1gb-data-bundle-discount" },
                      description: {
                        _text:
                          "You've won 30% off a 1GB Data bundle. Was R60.00 now only R42.00"
                      }
                    },
                    {
                      reference: { _text: "50mg-data-bundle-discount" },
                      description: {
                        _text:
                          "You've won 20% off a 50MB Data bundle. Was R8.00 now only R6.40"
                      }
                    },
                    {
                      reference: { _text: "50mg-data-bundle-discount" },
                      description: { _text: "You've won a 50MB Data bundle." }
                    },
                    {
                      reference: { _text: "30mg-data-bundle-discount" },
                      description: {
                        _text:
                          "You've won 10% off a 30MB Data bundle. Was R5.00 now only R4.50"
                      }
                    },
                    {
                      reference: { _text: "500-salon-voucher" },
                      description: { _text: "You've won a R500 Salon Voucher" }
                    },
                    {
                      reference: { _text: "gamesforce-voucher" },
                      description: {
                        _text:
                          "You've won 7 Days free access to GamesForce Premium"
                      }
                    },
                    {
                      reference: { _text: "gamesforce-voucher" },
                      description: {
                        _text: "You've won a subscription to GamesForce Premium"
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    }
  }
};

const testWalletData = {
  statusCode: 200,
  data: {
    WalletRespone: {
      Wallet: {
        LineItems: {
          LineItem: {
            WalletElement: {
              CustomerProduct: {
                Ids: {
                  accountId: { _text: "ef055288-e803-4b19-870f-7407a5b69ec7" }
                },
                name: { _text: "Demo Account" }
              },
              WalletSpecifications: {
                Items: {
                  msisdn: { _text: "0829991234" },
                  result: { _text: "0" },
                  reward: [
                    {
                      description: { _text: "You've won a 50MB Data bundle." },
                      timestamp: { _text: "2022-03-06T09:04:24.691Z" }
                    },
                    {
                      description: {
                        _text:
                          "You've won 10% off a 30MB Data bundle. Was R5.00 now only R4.50"
                      },
                      timestamp: { _text: "2022-03-06T09:08:18.146Z" }
                    },
                    {
                      description: {
                        _text: "You've won a subscription to GamesForce Premium"
                      },
                      timestamp: { _text: "2022-03-06T09:08:30.719Z" }
                    },
                    {
                      description: {
                        _text:
                          "You've won 30% off a 1GB Data bundle. Was R60.00 now only R42.00"
                      },
                      timestamp: { _text: "2022-03-06T09:09:22.692Z" }
                    },
                    {
                      description: {
                        _text:
                          "You've won 10% off a 30MB Data bundle. Was R5.00 now only R4.50"
                      },
                      timestamp: { _text: "2022-03-06T09:15:23.807Z" }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    }
  }
};

const testWalletDataSingleWallet = {
  statusCode: 200,
  data: {
    WalletRespone: {
      Wallet: {
        LineItems: {
          LineItem: {
            WalletElement: {
              CustomerProduct: {
                Ids: {
                  accountId: { _text: "ef055288-e803-4b19-870f-7407a5b69ec7" }
                },
                name: { _text: "Demo Account" }
              },
              WalletSpecifications: {
                Items: {
                  msisdn: { _text: "0829991234" },
                  result: { _text: "0" },
                  reward: {
                    description: {
                      _text:
                        "You've won 30% off a 1GB Data bundle. Was R60.00 now only R42.00"
                    },
                    timestamp: { _text: "2022-03-06T09:09:22.692Z" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

let rewardsResults = testRewardsData;

/* test a array [wallet] */
// let walletData = testWalletData;

/* test a single {wallet} entry */
let walletData = testWalletDataSingleWallet;

const test =
  walletData.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement
    .WalletSpecifications.Items.reward;
console.log(
  "test",
  Array.isArray(
    walletData.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement
      .WalletSpecifications.Items.reward
  )
);

rewardsResults =
  rewardsResults && rewardsResults.data && rewardsResults.data.RewardRespone
    ? rewardsResults.data.RewardRespone.Reward.LineItems.LineItem.RewardElement.RewardSpecifications.Items.reward.map(
        (reward) => {
          return {
            ref: reward.reference._text,
            description: reward.description._text
          };
        }
      )
    : "";

// reconstruct of the wallet for the reponse && counter for when not an array is returned. - not mentioned in document example.
walletData =
  walletData &&
  walletData.data &&
  walletData.data.WalletRespone &&
  walletData.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement
    .WalletSpecifications.Items.reward &&
  Array.isArray(
    walletData.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement
      .WalletSpecifications.Items.reward
  )
    ? walletData.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement.WalletSpecifications.Items.reward.map(
        (reward) => {
          return {
            description: reward.description._text,
            awardedAt: reward.timestamp._text
          };
        }
      )
    : walletData.data.WalletRespone.Wallet.LineItems.LineItem.WalletElement
        .WalletSpecifications.Items.reward
    ? [
        {
          description:
            walletData.data.WalletRespone.Wallet.LineItems.LineItem
              .WalletElement.WalletSpecifications.Items.reward.description
              ._text,
          timestamp:
            walletData.data.WalletRespone.Wallet.LineItems.LineItem
              .WalletElement.WalletSpecifications.Items.reward.timestamp._text
        }
      ]
    : [];

let walletArray = [];
for (let i = 0; i < walletData.length; i++) {
  for (let k = 0; k < rewardsResults.length; k++) {
    if (walletData[i].description === rewardsResults[k].description) {
      walletArray[i] = {
        ref: rewardsResults[k].ref,
        description: walletData[i].description,
        awardedAt: walletData[i].timestamp
          ? walletData[i].timestamp
          : walletData[i].awardedAt
      };

      // another way of doing it
      // walletObject[i] = {
      //   ...walletData[i],
      //   ref: rewardsResults[k].ref
      // }
    }
  }
}

console.log("NEW WALLET OBJECT::", walletArray);

const msisdn = "081112222";

let ObjResponseConstructor = new Object();

// 200: reponse object
if (
  //data.statusCode === 200
  true
) {
  ObjResponseConstructor = {
    wallet: walletArray,
    response: {
      status: 200,
      message: `profile for user ${msisdn}`
    }
  };
}

// JSON REPONSE
console.log(
  "200 OK REPONSE",
  JSON.stringify(ObjResponseConstructor, null, "\t")
);
